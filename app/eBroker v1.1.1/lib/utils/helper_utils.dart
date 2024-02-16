import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:ebroker/exports/main_export.dart';
//import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/api.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_image/flutter_native_image.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http/http.dart';
import 'package:share_plus/share_plus.dart';

import '../data/helper/custom_exception.dart';

enum MessageType {
  success(successMessageColor),
  warning(warningMessageColor),
  error(errorMessageColor);

  final Color value;
  const MessageType(this.value);
}

class HelperUtils {
  static Future<bool> checkInternet() async {
    bool check = false;
    var connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.mobile) {
      check = true;
    } else if (connectivityResult == ConnectivityResult.wifi) {
      check = true;
    }
    return check;
  }

  static String checkHost(String url) {
    if (url.endsWith("/")) {
      return url;
    } else {
      return "$url/";
    }
  }

  static Future<void> precacheSVG(List<String> urls) async {
    bool isSvgUrl(String url) {
      // Convert the URL to lowercase for a case-insensitive check
      final lowercaseUrl = url.toLowerCase();

      // Check if the URL ends with ".svg"
      return lowercaseUrl.endsWith('.svg');
    }

    for (String imageUrl in urls) {
      if (isSvgUrl(imageUrl)) {
        await precachePicture(
          NetworkPicture(
            SvgPicture.svgByteDecoderBuilder,
            imageUrl,
          ),
          null,
        );
      } else {
        continue;
      }
    }
  }

  static int comparableVersion(String version) {
    //removing dot from version and parsing it into int
    String plain = version.replaceAll(".", "");

    return int.parse(plain);
  }

  static String nativeDeepLinkUrlOfProperty(String slug) {
    return "https://${AppSettings.shareNavigationWebUrl}/properties-details/$slug";
  }

  static void share(BuildContext context, int propertyId, String slugId) {
    showModalBottomSheet(
      context: context,
      backgroundColor: context.color.backgroundColor,
      builder: (context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.copy),
              title: Text("copylink".translate(context)),
              onTap: () async {
                String deepLink = "";
                if (AppSettings.deepLinkingType == DeepLinkType.native) {
                  deepLink = nativeDeepLinkUrlOfProperty(slugId);
                } else {
                  deepLink = await DeepLinkManager.buildDynamicLink(propertyId);
                }

                await Clipboard.setData(ClipboardData(text: deepLink));

                Future.delayed(Duration.zero, () {
                  Navigator.pop(context);
                  HelperUtils.showSnackBarMessage(
                      context, "copied".translate(context));
                });
              },
            ),
            ListTile(
              leading: const Icon(Icons.share),
              title: Text("share".translate(context)),
              onTap: () async {
                String deepLink = "";

                if (AppSettings.deepLinkingType == DeepLinkType.native) {
                  deepLink = nativeDeepLinkUrlOfProperty(slugId);
                } else {
                  deepLink = await DeepLinkManager.buildDynamicLink(propertyId);
                }

                String text =
                    "Exciting find! 🏡 Check out this amazing property I came across.  Let me know what you think! ⭐\n Here are the details:\n$deepLink.";
                await Share.share(text);
              },
            ),
          ],
        );
      },
    );
  }

  static void unfocus() {
    FocusManager.instance.primaryFocus?.unfocus();
  }

  static checkIsUserInfoFilled({String name = "", String email = ""}) {
    String chkname = name;
    if (name.trim().isEmpty) {
      // chkname = Constant.session.getStringData(Session.keyUserName);
    }
    return chkname.trim().isNotEmpty;
  }

  static String mobileNumberWithoutCountryCode() {
    String? mobile = HiveUtils.getUserDetails().mobile;

    String? countryCode = HiveUtils.getCountryCode();

    int countryCodeLength = (countryCode?.length ?? 0);

    String mobileNumber = mobile!.substring(countryCodeLength, mobile.length);

    return mobileNumber;
  }

  static showSnackBarMessage(BuildContext? context, String message,
      {int messageDuration = 3,
      MessageType? type,
      bool? isFloating,
      VoidCallback? onClose}) async {
    var snackBar = ScaffoldMessenger.of(context!).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: (isFloating ?? false) ? SnackBarBehavior.floating : null,
        backgroundColor: type?.value,
        duration: Duration(seconds: messageDuration),
      ),
    );
    var snackBarClosedReason = await snackBar.closed;
    if (SnackBarClosedReason.values.contains(snackBarClosedReason)) {
      onClose?.call();
    }
  }

  static Future sendApiRequest(
    String url,
    Map<String, dynamic> body,
    bool ispost,
    BuildContext context, {
    bool passUserid = true,
  }) async {
    Map<String, String> headersdata = {
      "accept": "application/json",
    };

    String token = HiveUtils.getJWT().toString();
    if (token.trim().isNotEmpty) {
      headersdata["Authorization"] = "Bearer $token";
    }
    if (passUserid && HiveUtils.isUserAuthenticated()) {
      body[Api.userid] = HiveUtils.getUserId().toString();
    }
    Response response;
    try {
      if (ispost) {
        response = await post(
          Uri.parse(Constant.baseUrl + url),
          body: body.isNotEmpty ? body : null,
          headers: headersdata,
        );
      } else {
        response = await get(
          Uri.parse(
            Constant.baseUrl + url,
          ),
          headers: headersdata,
        );
      }
      await Future.delayed(
        Duration.zero,
        () {
          return getJsonResponse(context,
              isfromfile: false, response: response);
        },
      );
    } on SocketException {
      throw FetchDataException("noInternetErrorMsg".translate(context));
    } on TimeoutException {
      throw FetchDataException("nodatafound".translate(context));
    } on Exception catch (e) {
      throw Exception(e.toString());
    }
  }

  static getJsonResponse(BuildContext context,
      {bool isfromfile = false,
      StreamedResponse? streamedResponse,
      Response? response}) async {
    int code;
    if (isfromfile) {
      code = streamedResponse!.statusCode;
    } else {
      code = response!.statusCode;
    }
    switch (code) {
      case 200:
        if (isfromfile) {
          var responseData = await streamedResponse!.stream.toBytes();
          return String.fromCharCodes(responseData);
        } else {
          return response!.body;
        }

      case 400:
        throw BadRequestException(response!.body.toString());
      case 401: /* Constant.isUserDeactivated = true;
        print("isDeactivated ? -- ${Constant.isUserDeactivated}");
        break; */

        Map getdata = {};
        if (isfromfile) {
          var responseData = await streamedResponse!.stream.toBytes();
          getdata = json.decode(String.fromCharCodes(responseData));
        } else {
          getdata = json.decode(response!.body);
        }

        Future.delayed(
          Duration.zero,
          () {
            showSnackBarMessage(context, getdata[Api.message]);
          },
        );
        throw UnauthorisedException(getdata[Api.message]);
      case 403:
        throw UnauthorisedException(response!.body.toString());
      case 500:
      default:
        throw FetchDataException(
            'Error occurred while Communication with Server with StatusCode: $code');
    }
  }

  static String getFileSizeString({required int bytes, int decimals = 0}) {
    const suffixes = ["b", "kb", "mb", "gb", "tb"];
    if (bytes == 0) return '0${suffixes[0]}';
    var i = (log(bytes) / log(1024)).floor();
    return ((bytes / pow(1024, i)).toStringAsFixed(decimals)) + suffixes[i];
  }

  static killPreviousPages(BuildContext context, var nextpage, var args) {
    Navigator.of(context)
        .pushNamedAndRemoveUntil(nextpage, (route) => false, arguments: args);
  }

  static goToNextPage(var nextpage, BuildContext bcontext, bool isreplace,
      {Map? args}) {
    if (isreplace) {
      Navigator.of(bcontext).pushReplacementNamed(nextpage, arguments: args);
    } else {
      Navigator.of(bcontext).pushNamed(nextpage, arguments: args);
    }
  }

  static String setFirstLetterUppercase(String value) {
    if (value.isNotEmpty) value = value.replaceAll("_", ' ');
    return value.toTitleCase();
  }

  static Widget checkVideoType(String url,
      {required Widget Function() onYoutubeVideo,
      required Widget Function() onOtherVideo}) {
    List youtubeDomains = ["youtu.be", "youtube.com"];

    Uri uri = Uri.parse(url);
    var host = uri.host.toString().replaceAll("www.", "");
    if (youtubeDomains.contains(host)) {
      return onYoutubeVideo.call();
    } else {
      return onOtherVideo.call();
    }
  }

  static bool isYoutubeVideo(String url) {
    List youtubeDomains = ["youtu.be", "youtube.com"];

    Uri uri = Uri.parse(url);
    var host = uri.host.toString().replaceAll("www.", "");
    if (youtubeDomains.contains(host)) {
      return true;
    } else {
      return false;
    }
  }

  static Future<File?> compressImageFile(File file) async {
    try {
      //final compressedFile = await FlutterNativeImage.compressImage(file.path,quality: Constant.imgQuality,targetWidth: Constant.maxImgWidth,targetHeight: Constant.maxImgHeight);
      final compressedFile = await FlutterNativeImage.compressImage(
        file.path,
        quality: Constant.uploadImageQuality,
      );
      return File(compressedFile.path);
    } catch (e) {
      return null; //If any error occurs during compression, the process is stopped.
    }
  }
}

extension StringCasingExtension on String {
  String toCapitalized() =>
      length > 0 ? '${this[0].toUpperCase()}${substring(1).toLowerCase()}' : '';
  String toTitleCase() => replaceAll(RegExp(' +'), ' ')
      .split(' ')
      .map((str) => str.toCapitalized())
      .join(' ');
}
