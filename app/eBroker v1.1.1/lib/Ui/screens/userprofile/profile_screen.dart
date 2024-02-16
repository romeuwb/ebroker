import 'dart:io';

import 'package:ebroker/Ui/screens/Personalized/personalized_property_screen.dart';
import 'package:ebroker/Ui/screens/main_activity.dart';
import 'package:ebroker/data/model/user_model.dart';
import 'package:ebroker/utils/guestChecker.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:launch_review/launch_review.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../app/app_theme.dart';
import '../../../app/routes.dart';
import '../../../data/cubits/Utility/like_properties.dart';
import '../../../data/cubits/system/app_theme_cubit.dart';
import '../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../data/cubits/system/user_details.dart';
import '../../../data/model/system_settings_model.dart';
import '../../../utils/AppIcon.dart';
import '../../../utils/Extensions/extensions.dart';
import '../../../utils/Network/apiCallTrigger.dart';
import '../../../utils/api.dart';
import '../../../utils/constant.dart';
import '../../../utils/helper_utils.dart';
import '../../../utils/hive_utils.dart';
import '../../../utils/responsiveSize.dart';
import '../../../utils/ui_utils.dart';
import '../widgets/blurred_dialoge_box.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with AutomaticKeepAliveClientMixin<ProfileScreen> {
  ValueNotifier isDarkTheme = ValueNotifier(false);
  // with SingleTickerProviderStateMixin {
  bool isGuest = false;
  @override
  void initState() {
    var settings = context.read<FetchSystemSettingsCubit>();
    isGuest = GuestChecker.value;
    GuestChecker.listen().addListener(() {
      isGuest = GuestChecker.value;
      if (mounted) setState(() {});
    });
    if (!const bool.fromEnvironment("force-disable-demo-mode",
        defaultValue: false)) {
      Constant.isDemoModeOn =
          settings.getSetting(SystemSetting.demoMode) ?? false;
    }
    super.initState();
  }

  @override
  void didChangeDependencies() {
    isDarkTheme.value = context.read<AppThemeCubit>().isDarkMode();
    super.didChangeDependencies();
  }

  @override
  void dispose() {
    isDarkTheme.dispose();
    super.dispose();
  }

  @override
  bool get wantKeepAlive => true;
  int? a;
  @override
  Widget build(BuildContext context) {
    super.build(context);

    // log(a!.toString());
    var settings = context.watch<FetchSystemSettingsCubit>();

    if (!const bool.fromEnvironment("force-disable-demo-mode",
        defaultValue: false)) {
      Constant.isDemoModeOn =
          settings.getSetting(SystemSetting.demoMode) ?? false;
    }

    var username = "Anonymous";
    var email = "Not logged in";
    if (!isGuest) {
      UserModel? user = context.watch<UserDetailsCubit>().state.user;
      username = user?.name!.firstUpperCase() ?? "Anonymous";
      email = (user?.email) ?? "Login first";
    }
    return AnnotatedRegion(
      value: SystemUiOverlayStyle(
          systemNavigationBarDividerColor: Colors.transparent,
          // systemNavigationBarColor: Theme.of(context).colorScheme.secondaryColor,
          systemNavigationBarIconBrightness:
              context.watch<AppThemeCubit>().state.appTheme == AppTheme.dark
                  ? Brightness.light
                  : Brightness.dark,
          //
          statusBarColor: Theme.of(context).colorScheme.secondaryColor,
          statusBarBrightness:
              context.watch<AppThemeCubit>().state.appTheme == AppTheme.dark
                  ? Brightness.dark
                  : Brightness.light,
          statusBarIconBrightness:
              context.watch<AppThemeCubit>().state.appTheme == AppTheme.dark
                  ? Brightness.light
                  : Brightness.dark),
      child: Scaffold(
        backgroundColor: context.color.primaryColor,
        appBar: UiUtils.buildAppBar(
          context,
          title: UiUtils.getTranslatedLabel(context, "myProfile"),
        ),
        body: ScrollConfiguration(
          behavior: RemoveGlow(),
          child: SingleChildScrollView(
            controller: profileScreenController,
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: Column(children: <Widget>[
                Container(
                  height: 91,
                  decoration: BoxDecoration(
                    border: Border.all(
                      width: 1.5,
                      color: context.color.borderColor,
                    ),
                    color: context.color.secondaryColor,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(18),
                          child: profileImgWidget(),
                        ),
                        SizedBox(
                          width: context.screenWidth * 0.015,
                        ),
                        SizedBox(
                          // height: 77,
                          child: Column(
                            // crossAxisAlignment: CrossAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              SizedBox(
                                width: context.screenWidth * 0.35,
                                child: Text(username)
                                    .color(context.color.textColorDark)
                                    .size(context.font.large)
                                    .bold(weight: FontWeight.w700)
                                    .setMaxLines(lines: 1),
                              ),
                              SizedBox(
                                width: context.screenWidth * 0.35,
                                child: Text(email)
                                    .color(context.color.textColorDark)
                                    .size(context.font.small)
                                    .setMaxLines(lines: 1),
                              ),
                            ],
                          ),
                        ),
                        const Spacer(),
                        GuestChecker.updateUI(
                          onChangeStatus: (bool? isGuest) {
                            if (isGuest == true) {
                              return MaterialButton(
                                shape: RoundedRectangleBorder(
                                  side: BorderSide(
                                    color: context.color.borderColor,
                                    width: 1.5,
                                  ),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                onPressed: () {
                                  Navigator.pushNamed(
                                    context,
                                    Routes.login,
                                    arguments: {"popToCurrent": true},
                                  );
                                },
                                child: const Text("Login"),
                              );
                            }

                            return InkWell(
                              onTap: () {
                                HelperUtils.goToNextPage(
                                    Routes.completeProfile, context, false,
                                    args: {"from": "profile"});
                              },
                              child: Container(
                                width: 40.rw(context),
                                height: 40.rh(context),
                                decoration: BoxDecoration(
                                  color: context.color.secondaryColor,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: context.color.borderColor,
                                    width: 1.5,
                                  ),
                                ),
                                child: FittedBox(
                                  fit: BoxFit.none,
                                  child: SizedBox(
                                    width: 12.rw(context),
                                    height: 22.rh(context),
                                    child: UiUtils.getSvg(
                                      AppIcons.arrowRight,
                                      color: context.color.textColorDark,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        )
                      ],
                    ),
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(
                      width: 1.5,
                      color: context.color.borderColor,
                    ),
                    color: context.color.secondaryColor,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      const SizedBox(
                        height: 20,
                      ),
                      // customTile(
                      //   context,
                      //   title: "ONLY FOR DEVELOPMENT",
                      //   svgImagePath: AppIcons.enquiry,
                      //   onTap: () async {
                      //     var s = await FirebaseMessaging.instance.getToken();
                      //     Navigator.push(context, MaterialPageRoute(
                      //       builder: (context) {
                      //         return Scaffold(
                      //           body: Padding(
                      //             padding: const EdgeInsets.all(20.0),
                      //             child: Center(
                      //               child: SelectableText(s.toString()),
                      //             ),
                      //           ),
                      //         );
                      //       },
                      //     ));
                      //   },
                      // ),
                      // dividerWithSpacing(),
                      // customTile(
                      //   context,
                      //   title: UiUtils.getTranslatedLabel(context, "myEnquiry"),
                      //   svgImagePath: AppIcons.enquiry,
                      //   onTap: () {
                      //     Navigator.pushNamed(context, Routes.myEnquiry);
                      //   },
                      // ),
                      // dividerWithSpacing(),
                      //THIS IS EXPERIMENTAL
                      if (false) ...[
                        customTile(
                          context,
                          title:
                              UiUtils.getTranslatedLabel(context, "Dashboard"),
                          svgImagePath: AppIcons.promoted,
                          onTap: () {
                            Navigator.pushNamed(context, Routes.dashboard);
                          },
                        ),
                        dividerWithSpacing(),
                      ],

                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "myAds"),
                        svgImagePath: AppIcons.promoted,
                        onTap: () async {
                          APICallTrigger.trigger();
                          GuestChecker.check(
                            onNotGuest: () {
                              Navigator.pushNamed(
                                  context, Routes.myAdvertisment);
                            },
                          );
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title:
                            UiUtils.getTranslatedLabel(context, "subscription"),
                        svgImagePath: AppIcons.subscription,
                        onTap: () async {
                          GuestChecker.check(onNotGuest: () {
                            Navigator.pushNamed(
                                context, Routes.subscriptionPackageListRoute);
                          });
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(
                            context, "transactionHistory"),
                        svgImagePath: AppIcons.transaction,
                        onTap: () {
                          GuestChecker.check(onNotGuest: () {
                            Navigator.pushNamed(
                                context, Routes.transactionHistory);
                          });
                        },
                      ),
                      dividerWithSpacing(),

                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(
                          context,
                          "personalized",
                        ),
                        svgImagePath: AppIcons.magic,
                        onTap: () {
                          GuestChecker.check(onNotGuest: () {
                            Navigator.pushNamed(
                                context, Routes.personalizedPropertyScreen,
                                arguments: {
                                  "type": PersonalizedVisitType.Normal
                                });
                          });
                        },
                      ),
                      dividerWithSpacing(),

                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "language"),
                        svgImagePath: AppIcons.language,
                        onTap: () {
                          Navigator.pushNamed(
                              context, Routes.languageListScreenRoute);
                        },
                      ),
                      dividerWithSpacing(),
                      ValueListenableBuilder(
                          valueListenable: isDarkTheme,
                          builder: (context, v, c) {
                            return customTile(
                              context,
                              title: UiUtils.getTranslatedLabel(
                                  context, "darkTheme"),
                              svgImagePath: AppIcons.darkTheme,
                              isSwitchBox: true,
                              onTapSwitch: (value) {
                                context.read<AppThemeCubit>().changeTheme(
                                    value == true
                                        ? AppTheme.dark
                                        : AppTheme.light);
                                setState(() {
                                  isDarkTheme.value = value;
                                });
                              },
                              switchValue: v,
                              onTap: () {},
                            );
                          }),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(
                            context, "notifications"),
                        svgImagePath: AppIcons.notification,
                        onTap: () {
                          GuestChecker.check(onNotGuest: () {
                            Navigator.pushNamed(
                                context, Routes.notificationPage);
                          });
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "articles"),
                        svgImagePath: AppIcons.articles,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            Routes.articlesScreenRoute,
                          );
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "favorites"),
                        svgImagePath: AppIcons.favorites,
                        onTap: () {
                          GuestChecker.check(onNotGuest: () {
                            Navigator.pushNamed(
                                context, Routes.favoritesScreen);
                          });
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(
                            context, "areaConvertor"),
                        svgImagePath: AppIcons.areaConvertor,
                        onTap: () {
                          Navigator.pushNamed(
                              context, Routes.areaConvertorScreen);
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "shareApp"),
                        svgImagePath: AppIcons.shareApp,
                        onTap: shareApp,
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "rateUs"),
                        svgImagePath: AppIcons.rateUs,
                        onTap: rateUs,
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "contactUs"),
                        svgImagePath: AppIcons.contactUs,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            Routes.contactUs,
                          );
                          // Navigator.pushNamed(context, Routes.ab);
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(context, "aboutUs"),
                        svgImagePath: AppIcons.aboutUs,
                        onTap: () {
                          Navigator.pushNamed(
                              context, Routes.profileSettings, arguments: {
                            'title':
                                UiUtils.getTranslatedLabel(context, "aboutUs"),
                            'param': Api.aboutApp
                          });
                          // Navigator.pushNamed(context, Routes.ab);
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(
                          context,
                          "termsConditions",
                        ),
                        svgImagePath: AppIcons.terms,
                        onTap: () {
                          Navigator.pushNamed(context, Routes.profileSettings,
                              arguments: {
                                'title': UiUtils.getTranslatedLabel(
                                    context, "termsConditions"),
                                'param': Api.termsAndConditions
                              });
                        },
                      ),
                      dividerWithSpacing(),
                      customTile(
                        context,
                        title: UiUtils.getTranslatedLabel(
                            context, "privacyPolicy"),
                        svgImagePath: AppIcons.privacy,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            Routes.profileSettings,
                            arguments: {
                              'title': UiUtils.getTranslatedLabel(
                                  context, "privacyPolicy"),
                              'param': Api.privacyPolicy
                            },
                          );
                        },
                      ),
                      if (Constant.isUpdateAvailable == true) ...[
                        dividerWithSpacing(),
                        updateTile(
                          context,
                          isUpdateAvailable: Constant.isUpdateAvailable,
                          title: UiUtils.getTranslatedLabel(context, "update"),
                          newVersion: Constant.newVersionNumber,
                          svgImagePath: AppIcons.update,
                          onTap: () async {
                            if (Platform.isIOS) {
                              await launchUrl(
                                  Uri.parse(Constant.appstoreURLios));
                            } else if (Platform.isAndroid) {
                              await launchUrl(
                                  Uri.parse(Constant.playstoreURLAndroid));
                            }
                          },
                        ),
                      ],

                      if (isGuest == false) ...[
                        dividerWithSpacing(),
                        customTile(
                          context,
                          title: UiUtils.getTranslatedLabel(
                              context, "deleteAccount"),
                          svgImagePath: AppIcons.delete,
                          onTap: () {
                            if (Constant.isDemoModeOn) {
                              HelperUtils.showSnackBarMessage(
                                  context,
                                  UiUtils.getTranslatedLabel(
                                      context, "thisActionNotValidDemo"));
                              return;
                            }

                            deleteConfirmWidget(
                                UiUtils.getTranslatedLabel(
                                    context, "deleteProfileMessageTitle"),
                                UiUtils.getTranslatedLabel(
                                    context, "deleteProfileMessageContent"),
                                true);
                          },
                        ),
                      ],
                      const SizedBox(
                        height: 20,
                      )
                    ],
                  ),
                ),
                const SizedBox(
                  height: 25,
                ),
                if (isGuest == false) ...[
                  UiUtils.buildButton(context, onPressed: () {
                    logOutConfirmWidget();
                  },
                      height: 52.rh(context),
                      prefixWidget: Padding(
                        padding: const EdgeInsetsDirectional.only(end: 16.0),
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                              color: context.color.secondaryColor,
                              borderRadius: BorderRadius.circular(10)),
                          child: FittedBox(
                              fit: BoxFit.none,
                              child: UiUtils.getSvg(AppIcons.logout,
                                  color: context.color.tertiaryColor)),
                        ),
                      ),
                      buttonTitle:
                          UiUtils.getTranslatedLabel(context, "logout"))
                ],
                // profileInfo(),
                // Expanded(
                //   child: profileMenus(),
                // )
              ]),
            ),
          ),
        ),
      ),
    );
  }

  Padding dividerWithSpacing() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: UiUtils.getDivider(),
    );
  }

  Widget updateTile(BuildContext context,
      {required String title,
      required String newVersion,
      required bool isUpdateAvailable,
      required String svgImagePath,
      Function(dynamic value)? onTapSwitch,
      dynamic switchValue,
      required VoidCallback onTap}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: GestureDetector(
        onTap: () {
          if (isUpdateAvailable) {
            onTap.call();
          }
        },
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: context.color.tertiaryColor
                    .withOpacity(0.10000000149011612),
                borderRadius: BorderRadius.circular(10),
              ),
              child: FittedBox(
                  fit: BoxFit.none,
                  child: isUpdateAvailable == false
                      ? const Icon(Icons.done)
                      : UiUtils.getSvg(svgImagePath,
                          color: context.color.tertiaryColor)),
            ),
            SizedBox(
              width: 25.rw(context),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(isUpdateAvailable == false
                        ? "uptoDate".translate(context)
                        : title)
                    .bold(weight: FontWeight.w700)
                    .color(context.color.textColorDark),
                if (isUpdateAvailable)
                  Text("v$newVersion")
                      .bold(weight: FontWeight.w300)
                      .color(context.color.textColorDark)
                      .size(context.font.small)
                      .italic()
              ],
            ),
            if (isUpdateAvailable) ...[
              const Spacer(),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  border:
                      Border.all(color: context.color.borderColor, width: 1.5),
                  color: context.color.secondaryColor
                      .withOpacity(0.10000000149011612),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: FittedBox(
                  fit: BoxFit.none,
                  child: SizedBox(
                    width: 8,
                    height: 15,
                    child: UiUtils.getSvg(
                      AppIcons.arrowRight,
                      color: context.color.textColorDark,
                    ),
                  ),
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }

//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3Ricm9rZXJodWIud3J0ZWFtLmluL2FwaS91c2VyX3NpZ251cCIsImlhdCI6MTY5Njg1MDQyNCwibmJmIjoxNjk2ODUwNDI0LCJqdGkiOiJxVTNpY1FsRFN3MVJ1T3M5Iiwic3ViIjoiMzg4IiwicHJ2IjoiMWQwYTAyMGFjZjVjNGI2YzQ5Nzk4OWRmMWFiZjBmYmQ0ZThjOGQ2MyIsImN1c3RvbWVyX2lkIjozODh9.Y8sQhZtz6xGROEMvrTwA6gSSfPK-YwuhwDDc7Yahfg4
  Widget customTile(BuildContext context,
      {required String title,
      required String svgImagePath,
      bool? isSwitchBox,
      Function(dynamic value)? onTapSwitch,
      dynamic switchValue,
      required VoidCallback onTap}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: GestureDetector(
        onTap: onTap,
        child: AbsorbPointer(
          absorbing: !(isSwitchBox ?? false),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: context.color.tertiaryColor
                      .withOpacity(0.10000000149011612),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: FittedBox(
                    fit: BoxFit.none,
                    child: UiUtils.getSvg(svgImagePath,
                        height: 24,
                        width: 24,
                        color: context.color.tertiaryColor)),
              ),
              SizedBox(
                width: 25.rw(context),
              ),
              Expanded(
                flex: 3,
                child: Text(title)
                    .bold(weight: FontWeight.w700)
                    .color(context.color.textColorDark),
              ),
              const Spacer(),
              if (isSwitchBox != true)
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    border: Border.all(
                        color: context.color.borderColor, width: 1.5),
                    color: context.color.secondaryColor
                        .withOpacity(0.10000000149011612),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: FittedBox(
                    fit: BoxFit.none,
                    child: SizedBox(
                      width: 8,
                      height: 15,
                      child: UiUtils.getSvg(
                        AppIcons.arrowRight,
                        color: context.color.textColorDark,
                      ),
                    ),
                  ),
                ),
              if (isSwitchBox ?? false)
                // CupertinoSwitch(value: value, onChanged: onChanged)
                SizedBox(
                  height: 40,
                  width: 30,
                  child: CupertinoSwitch(
                    activeColor: context.color.tertiaryColor,
                    value: switchValue ?? false,
                    onChanged: (value) {
                      onTapSwitch?.call(value);
                    },
                  ),
                )
            ],
          ),
        ),
      ),
    );
  }

  deleteConfirmWidget(String title, String desc, bool callDel) {
    UiUtils.showBlurredDialoge(
      context,
      dialoge: BlurredDialogBox(
        title: title,
        content: Text(desc, textAlign: TextAlign.center),
        acceptButtonName: "deleteBtnLbl".translate(context),
        cancelTextColor: context.color.textColorDark,
        svgImagePath: AppIcons.deleteIcon,
        isAcceptContainesPush: true,
        onAccept: () async {
          Navigator.of(context).pop();
          if (callDel) {
            Future.delayed(
              const Duration(microseconds: 100),
              () {
                Navigator.pushNamed(context, Routes.login,
                    arguments: {"isDeleteAccount": true});
              },
            );
          } else {
            HiveUtils.logoutUser(
              context,
              onLogout: () {},
            );
          }
        },
      ),
    );
  }

  Widget profileImgWidget() {
    return GestureDetector(
      onTap: () {
        if (HiveUtils.getUserDetails().profile != "" &&
            HiveUtils.getUserDetails().profile != null) {
          UiUtils.showFullScreenImage(
            context,
            provider: NetworkImage(
                context.read<UserDetailsCubit>().state.user?.profile ?? ""),
          );
        }
      },
      child: (context.watch<UserDetailsCubit>().state.user?.profile ?? "")
              .trim()
              .isEmpty
          ? buildDefaultPersonSVG(context)
          : Image.network(
              context.watch<UserDetailsCubit>().state.user?.profile ?? "",
              fit: BoxFit.cover,
              width: 49,
              height: 49,
              errorBuilder: (BuildContext context, Object exception,
                  StackTrace? stackTrace) {
                return buildDefaultPersonSVG(context);
              },
              loadingBuilder: (BuildContext context, Widget? child,
                  ImageChunkEvent? loadingProgress) {
                if (loadingProgress == null) return child!;
                return buildDefaultPersonSVG(context);
              },
            ),
    );
  }

  Widget buildDefaultPersonSVG(BuildContext context) {
    return Container(
      width: 49,
      height: 49,
      color: context.color.tertiaryColor.withOpacity(0.1),
      child: FittedBox(
        fit: BoxFit.none,
        child: UiUtils.getSvg(AppIcons.defaultPersonLogo,
            color: context.color.tertiaryColor, width: 30, height: 30),
      ),
    );
  }

  void shareApp() {
    try {
      if (Platform.isAndroid) {
        Share.share(
            '${Constant.appName}\n${Constant.playstoreURLAndroid}\n${Constant.shareappText}',
            subject: Constant.appName);
      } else {
        Share.share(
            '${Constant.appName}\n${Constant.appstoreURLios}\n${Constant.shareappText}',
            subject: Constant.appName);
      }
    } catch (e) {
      HelperUtils.showSnackBarMessage(context, e.toString());
    }
  }

  Future<void> rateUs() async {
    LaunchReview.launch(
      androidAppId: Constant.androidPackageName,
      iOSAppId: Constant.iOSAppId,
    );
  }

  void logOutConfirmWidget() {
    UiUtils.showBlurredDialoge(context,
        dialoge: BlurredDialogBox(
            title: UiUtils.getTranslatedLabel(context, "confirmLogoutTitle"),
            onAccept: () async {
              Future.delayed(
                Duration.zero,
                () {
                  HiveUtils.clear();
                  Constant.favoritePropertyList.clear();
                  context.read<UserDetailsCubit>().clear();
                  context.read<LikedPropertiesCubit>().state.liked.clear();

                  context.read<LikedPropertiesCubit>().clear();
                  HiveUtils.logoutUser(
                    context,
                    onLogout: () {},
                  );
                },
              );
            },
            cancelTextColor: context.color.textColorDark,
            svgImagePath: AppIcons.logoutIcon,
            content:
                Text(UiUtils.getTranslatedLabel(context, "confirmLogOutMsg"))));
  }
}
