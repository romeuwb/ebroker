import 'dart:io';

import 'package:ebroker/Ui/screens/Personalized/personalized_property_screen.dart';
import 'package:ebroker/Ui/screens/widgets/custom_text_form_field.dart';
import 'package:ebroker/Ui/screens/widgets/image_cropper.dart';
import 'package:ebroker/data/cubits/auth/auth_cubit.dart';
import 'package:ebroker/data/cubits/property/fetch_most_viewed_properties_cubit.dart';
import 'package:ebroker/data/cubits/property/fetch_nearby_property_cubit.dart';
import 'package:ebroker/data/cubits/property/fetch_promoted_properties_cubit.dart';
import 'package:ebroker/data/cubits/slider_cubit.dart';
import 'package:ebroker/data/cubits/system/user_details.dart';
import 'package:ebroker/data/helper/custom_exception.dart';
import 'package:ebroker/data/helper/designs.dart';
import 'package:ebroker/data/model/user_model.dart';
import 'package:ebroker/utils/AppIcon.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/constant.dart';
import 'package:ebroker/utils/hive_utils.dart';
import 'package:ebroker/utils/responsiveSize.dart';
import 'package:ebroker/utils/ui_utils.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

import '../../../app/routes.dart';
import '../../../data/helper/widgets.dart';
import '../../../data/model/google_place_model.dart';
import '../../../utils/helper_utils.dart';
import '../../../utils/hive_keys.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';
import '../widgets/BottomSheets/choose_location_bottomsheet.dart';

class UserProfileScreen extends StatefulWidget {
  final String from;
  final bool? navigateToHome;
  final bool? popToCurrent;
  const UserProfileScreen({
    Key? key,
    required this.from,
    this.navigateToHome,
    this.popToCurrent,
  }) : super(key: key);

  @override
  State<UserProfileScreen> createState() => UserProfileScreenState();

  static Route route(RouteSettings routeSettings) {
    Map arguments = routeSettings.arguments as Map;
    return BlurredRouter(
      builder: (_) => UserProfileScreen(
        from: arguments['from'] as String,
        popToCurrent: arguments['popToCurrent'] as bool?,
        navigateToHome: arguments['navigateToHome'] as bool?,
      ),
    );
  }
}

class UserProfileScreenState extends State<UserProfileScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  dynamic size;
  dynamic city, _state, country, placeid;
  String? name, email, address;
  File? fileUserimg;
  bool isNotificationsEnabled = true;
  @override
  void initState() {
    super.initState();

    city = HiveUtils.getCityName();
    _state = HiveUtils.getStateName();
    country = HiveUtils.getCountryName();
    placeid = HiveUtils.getCityPlaceId();
    phoneController.text = _saperateNumber();
    nameController.text = (HiveUtils.getUserDetails().name) ?? "";
    emailController.text = HiveUtils.getUserDetails().email ?? "";
    addressController.text = HiveUtils.getUserDetails().address ?? "";
    isNotificationsEnabled =
        HiveUtils.getUserDetails().notification == 1 ? true : false;
    //}

    _saperateNumber();
  }

  String _saperateNumber() {
    // FirebaseAuth.instance.currentUser.sendEmailVerification();
    String? mobile = HiveUtils.getUserDetails().mobile;

    String? countryCode = HiveUtils.getCountryCode();

    int countryCodeLength = (countryCode?.length ?? 0);

    String mobileNumber = mobile!.substring(countryCodeLength, mobile.length);

    mobileNumber = "+${countryCode!} $mobileNumber";
    return mobileNumber;
  }

  @override
  void dispose() {
    super.dispose();
    phoneController.dispose();
    nameController.dispose();
    emailController.dispose();
    addressController.dispose();
  }

  void _onTapChooseLocation() async {
    FocusManager.instance.primaryFocus?.unfocus();

    if (!const bool.fromEnvironment("force-disable-demo-mode",
        defaultValue: false)) {
      if (Constant.isDemoModeOn) {
        HelperUtils.showSnackBarMessage(context, "Not valid in demo mode");

        return;
      }
    }

    var result = await showModalBottomSheet(
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20), topRight: Radius.circular(20))),
      context: context,
      builder: (context) {
        return const ChooseLocatonBottomSheet();
      },
    );
    if (result != null) {
      GooglePlaceModel place = (result as GooglePlaceModel);

      city = place.city;
      country = place.country;
      _state = place.state;
      placeid = place.placeId;
    }
  }

  @override
  Widget build(BuildContext context) {
    size = MediaQuery.of(context).size;
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: safeAreaCondition(
        child: Scaffold(
          backgroundColor: context.color.primaryColor,
          appBar: widget.from == "login"
              ? null
              : UiUtils.buildAppBar(context, showBackButton: true),
          body: ScrollConfiguration(
            behavior: RemoveGlow(),
            child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                keyboardDismissBehavior:
                    ScrollViewKeyboardDismissBehavior.onDrag,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Form(
                      key: _formKey,
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Align(
                              alignment: Alignment.center,
                              child: buildProfilePicture(),
                            ),
                            buildTextField(
                              context,
                              title: "fullName",
                              controller: nameController,
                              validator: CustomTextFieldValidator.nullCheck,
                            ),
                            buildTextField(
                              context,
                              title: "companyEmailLbl",
                              controller: emailController,
                              validator: CustomTextFieldValidator.email,
                            ),
                            buildTextField(
                              context,
                              title: "phoneNumber",
                              controller: phoneController,
                              validator: CustomTextFieldValidator.nullCheck,
                              readOnly: true,
                            ),
                            buildAddressTextField(
                              context,
                              title: "addressLbl",
                              controller: addressController,
                              validator: CustomTextFieldValidator.nullCheck,
                            ),
                            const SizedBox(
                              height: 10,
                            ),
                            Text("enablesNewSection".translate(context))
                                .size(context.font.small)
                                .bold(weight: FontWeight.w300)
                                .color(
                                  context.color.textColorDark.withOpacity(0.8),
                                ),
                            SizedBox(
                              height: 20.rh(context),
                            ),
                            Text(
                              UiUtils.getTranslatedLabel(
                                  context, "notification"),
                            ),
                            SizedBox(
                              height: 10.rh(context),
                            ),
                            buildNotificationEnableDisableSwitch(context),
                            SizedBox(
                              height: 25.rh(context),
                            ),
                            UiUtils.buildButton(
                              context,
                              onPressed: () {
                                if (city != null && city != "") {
                                  HiveUtils.setLocation(
                                      city: city,
                                      state: _state,
                                      country: country,
                                      placeId: placeid);
                                  Hive.box(HiveKeys.userDetailsBox)
                                      .put(HiveKeys.cityTeemp, city);
                                  context
                                      .read<FetchNearbyPropertiesCubit>()
                                      .fetch(forceRefresh: true);

                                  context
                                      .read<FetchMostViewedPropertiesCubit>()
                                      .fetch();
                                  context
                                      .read<FetchPromotedPropertiesCubit>()
                                      .fetch();
                                  context
                                      .read<SliderCubit>()
                                      .fetchSlider(context);
                                } else {
                                  HiveUtils.clearLocation();
                                  context
                                      .read<FetchMostViewedPropertiesCubit>()
                                      .fetch();
                                  context
                                      .read<FetchNearbyPropertiesCubit>()
                                      .fetch(forceRefresh: true);

                                  context
                                      .read<FetchPromotedPropertiesCubit>()
                                      .fetch();
                                  context
                                      .read<SliderCubit>()
                                      .fetchSlider(context);
                                }
                                validateData();
                              },
                              height: 48.rh(context),
                              buttonTitle: UiUtils.getTranslatedLabel(
                                  context, "updateProfile"),
                            )
                          ])),
                )),
          ),
        ),
      ),
    );
  }

  Widget locationWidget(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        top: 10.0,
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 55,
              decoration: BoxDecoration(
                  color: context.color.textLightColor.withOpacity(00.01),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: context.color.borderColor,
                    width: 1.5,
                  )),
              child: Row(
                children: [
                  Padding(
                    padding: const EdgeInsetsDirectional.only(start: 10.0),
                    child: Align(
                        alignment: Alignment.centerLeft,
                        child: (city != "" && city != null)
                            ? Text("$city,$_state,$country")
                            : Text(UiUtils.getTranslatedLabel(
                                context, "selectLocationOptional"))),
                  ),
                  const Spacer(),
                  if (city != "" && city != null)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(end: 10.0),
                      child: GestureDetector(
                        onTap: () {
                          city = "";
                          _state = "";
                          country = "";
                          setState(() {});
                        },
                        child: Icon(
                          Icons.close,
                          color: context.color.textColorDark,
                        ),
                      ),
                    )
                ],
              ),
            ),
          ),
          const SizedBox(
            width: 10,
          ),
          GestureDetector(
            onTap: _onTapChooseLocation,
            child: Container(
              height: 55,
              width: 55,
              decoration: BoxDecoration(
                  color: context.color.textLightColor.withOpacity(00.01),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: context.color.borderColor,
                    width: 1.5,
                  )),
              child: Icon(
                Icons.location_searching_sharp,
                color: context.color.tertiaryColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget safeAreaCondition({required Widget child}) {
    if (widget.from == "login") {
      return SafeArea(child: child);
    }
    return child;
  }

  Widget buildNotificationEnableDisableSwitch(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          border: Border.all(
            color: context.color.borderColor,
          ),
          borderRadius: BorderRadius.circular(10),
          color: context.color.textLightColor.withOpacity(00.01)),
      height: 55.rh(context),
      width: double.infinity,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(UiUtils.getTranslatedLabel(
                    context, isNotificationsEnabled ? "enabled" : "disabled"))
                .size(context.font.large),
          ),
          CupertinoSwitch(
            activeColor: context.color.tertiaryColor,
            value: isNotificationsEnabled,
            onChanged: (value) {
              isNotificationsEnabled = value;
              setState(() {});
            },
          )
        ],
      ),
    );
  }

  Widget buildTextField(BuildContext context,
      {required String title,
      required TextEditingController controller,
      CustomTextFieldValidator? validator,
      bool? readOnly}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 10.rh(context),
        ),
        Text(UiUtils.getTranslatedLabel(context, title)),
        SizedBox(
          height: 10.rh(context),
        ),
        CustomTextFormField(
          controller: controller,
          isReadOnly: readOnly,
          validator: validator,
          // formaters: [FilteringTextInputFormatter.deny(RegExp(","))],
          fillColor: context.color.textLightColor.withOpacity(00.01),
        ),
      ],
    );
  }

  Widget buildAddressTextField(BuildContext context,
      {required String title,
      required TextEditingController controller,
      CustomTextFieldValidator? validator,
      bool? readOnly}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 10.rh(context),
        ),
        Text(UiUtils.getTranslatedLabel(context, title)),
        SizedBox(
          height: 10.rh(context),
        ),
        CustomTextFormField(
          controller: controller,
          maxLine: 5,
          action: TextInputAction.newline,
          isReadOnly: readOnly,
          validator: validator,
          fillColor: context.color.textLightColor.withOpacity(00.01),
        ),
        const SizedBox(
          width: 10,
        ),
        locationWidget(context),
      ],
    );
  }

  Widget getProfileImage() {
    if (fileUserimg != null) {
      return Image.file(
        fileUserimg!,
        fit: BoxFit.cover,
      );
    } else {
      if (widget.from == "login") {
        if (HiveUtils.getUserDetails().profile != "" &&
            HiveUtils.getUserDetails().profile != null) {
          return UiUtils.getImage(
            HiveUtils.getUserDetails().profile!,
            fit: BoxFit.cover,
          );
        }

        return UiUtils.getSvg(
          AppIcons.defaultPersonLogo,
          color: context.color.tertiaryColor,
          fit: BoxFit.none,
        );
      } else {
        if ((HiveUtils.getUserDetails().profile ?? "").isEmpty) {
          return UiUtils.getSvg(
            AppIcons.defaultPersonLogo,
            color: context.color.tertiaryColor,
            fit: BoxFit.none,
          );
        } else {
          return UiUtils.getImage(
            HiveUtils.getUserDetails().profile!,
            fit: BoxFit.cover,
          );
        }
      }
    }
  }

  Widget buildProfilePicture() {
    return Stack(
      children: [
        Container(
          height: 124.rh(context),
          width: 124.rw(context),
          alignment: Alignment.center,
          decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: context.color.tertiaryColor, width: 2)),
          child: Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: context.color.tertiaryColor.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            width: 106.rw(context),
            height: 106.rh(context),
            child: getProfileImage(),
          ),
        ),
        PositionedDirectional(
          bottom: 0,
          end: 0,
          child: InkWell(
            onTap: showPicker,
            child: Container(
                height: 37.rh(context),
                width: 37.rw(context),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                    border: Border.all(
                        color: context.color.buttonColor, width: 1.5),
                    shape: BoxShape.circle,
                    color: context.color.tertiaryColor),
                child: SizedBox(
                    width: 15.rw(context),
                    height: 15.rh(context),
                    child: UiUtils.getSvg(AppIcons.edit))),
          ),
        )
      ],
    );
  }

  Future<void> validateData() async {
    if (_formKey.currentState!.validate()) {
      bool checkinternet = await HelperUtils.checkInternet();
      if (!checkinternet) {
        Future.delayed(
          Duration.zero,
          () {
            HelperUtils.showSnackBarMessage(context,
                UiUtils.getTranslatedLabel(context, "lblchecknetwork"));
          },
        );

        return;
      }
      process();
    }
  }

  process() async {
    Widgets.showLoader(context);
    try {
      var response = await context.read<AuthCubit>().updateUserData(context,
          name: nameController.text.trim(),
          email: emailController.text.trim(),
          fileUserimg: fileUserimg,
          city: city,
          state: _state,
          country: country,
          address: addressController.text,
          notification: isNotificationsEnabled == true ? "1" : "0");

      Future.delayed(
        Duration.zero,
        () {
          context
              .read<UserDetailsCubit>()
              .copy(UserModel.fromJson(response['data']));
        },
      );

      Future.delayed(
        Duration.zero,
        () {
          Widgets.hideLoder(context);
          HelperUtils.showSnackBarMessage(
            context,
            UiUtils.getTranslatedLabel(context, "profileupdated"),
            onClose: () {
              if (mounted) Navigator.pop(context);
            },
          );
          if (widget.navigateToHome ?? false) {
            Navigator.pop(context);
          }
        },
      );

      if (widget.from == "login" && widget.popToCurrent != true) {
        Future.delayed(
          Duration.zero,
          () {
            HelperUtils.killPreviousPages(
                context, Routes.personalizedPropertyScreen, {
              "type": PersonalizedVisitType.FirstTime,
            });

            // HelperUtils.killPreviousPages(
            //     context, Routes.main, {"from": widget.from});
          },
        );
      } else if (widget.from == "login" && widget.popToCurrent == true) {
        Future.delayed(Duration.zero, () {
          Navigator.of(context)
            ..pop()
            ..pop();
        });
      }
    } on CustomException catch (e) {
      Future.delayed(Duration.zero, () {
        Widgets.hideLoder(context);
        HelperUtils.showSnackBarMessage(context, e.toString());
      });
    }
  }

  void showPicker() {
    showModalBottomSheet(
        context: context,
        shape: setRoundedBorder(10),
        builder: (BuildContext bc) {
          return SafeArea(
            child: Wrap(
              children: <Widget>[
                ListTile(
                    leading: const Icon(Icons.photo_library),
                    title: Text(UiUtils.getTranslatedLabel(context, "gallery")),
                    onTap: () {
                      _imgFromGallery(ImageSource.gallery);
                      Navigator.of(context).pop();
                    }),
                ListTile(
                  leading: const Icon(Icons.photo_camera),
                  title: Text(UiUtils.getTranslatedLabel(context, "camera")),
                  onTap: () {
                    _imgFromGallery(ImageSource.camera);
                    Navigator.of(context).pop();
                  },
                ),
                if (fileUserimg != null && widget.from == 'login')
                  ListTile(
                    leading: const Icon(Icons.clear_rounded),
                    title:
                        Text(UiUtils.getTranslatedLabel(context, "lblremove")),
                    onTap: () {
                      fileUserimg = null;

                      Navigator.of(context).pop();
                      setState(() {});
                    },
                  ),
              ],
            ),
          );
        });
  }

  _imgFromGallery(ImageSource imageSource) async {
    CropImage.init(context);

    final pickedFile = await ImagePicker().pickImage(source: imageSource);

    if (pickedFile != null) {
      CroppedFile? croppedFile;
      croppedFile = await CropImage.crop(filePath: pickedFile.path);
      if (croppedFile == null) {
        fileUserimg = null;
      } else {
        fileUserimg = File(croppedFile.path);
      }
    } else {
      fileUserimg = null;
    }
    setState(() {});
  }
}
