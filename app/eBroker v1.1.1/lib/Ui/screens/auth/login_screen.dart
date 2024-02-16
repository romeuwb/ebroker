import 'dart:async';
import 'dart:developer';
import 'dart:io';

import 'package:country_picker/country_picker.dart';
import 'package:ebroker/settings.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_sim_country_code/flutter_sim_country_code.dart';
import 'package:sms_autofill/sms_autofill.dart';

import '../../../app/routes.dart';
import '../../../data/cubits/auth/auth_cubit.dart';
import '../../../data/cubits/auth/login_cubit.dart';
import '../../../data/cubits/auth/send_otp_cubit.dart';
import '../../../data/cubits/auth/verify_otp_cubit.dart';
import '../../../data/cubits/system/delete_account_cubit.dart';
import '../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../data/cubits/system/user_details.dart';
import '../../../data/helper/designs.dart';
import '../../../data/helper/widgets.dart';
import '../../../data/model/system_settings_model.dart';
import '../../../utils/AppIcon.dart';
import '../../../utils/Extensions/extensions.dart';
import '../../../utils/Network/apiCallTrigger.dart';
import '../../../utils/api.dart';
import '../../../utils/constant.dart';
import '../../../utils/guestChecker.dart';
import '../../../utils/helper_utils.dart';
import '../../../utils/hive_utils.dart';
import '../../../utils/responsiveSize.dart';
import '../../../utils/ui_utils.dart';
import '../../../utils/validator.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';

class LoginScreen extends StatefulWidget {
  final bool? isDeleteAccount;
  final bool? popToCurrent;
  const LoginScreen({Key? key, this.isDeleteAccount, this.popToCurrent})
      : super(key: key);

  @override
  State<LoginScreen> createState() => LoginScreenState();
  static route(RouteSettings routeSettings) {
    Map? args = routeSettings.arguments as Map?;
    return BlurredRouter(
      builder: (_) => MultiBlocProvider(
        providers: [
          BlocProvider(create: (context) => SendOtpCubit()),
          BlocProvider(create: (context) => VerifyOtpCubit()),
        ],
        child: LoginScreen(
          isDeleteAccount: args?['isDeleteAccount'],
          popToCurrent: args?['popToCurrent'],
        ),
      ),
    );
  }
}

class LoginScreenState extends State<LoginScreen> {
  final TextEditingController mobileNumController = TextEditingController(
      text: Constant.isDemoModeOn ? Constant.demoMobileNumber : "");
  //final TextEditingController otpController = TextEditingController();
  final List<TextEditingController> _controllers = [];
  final List<FocusNode> _focusNodes = [];
  List<Widget> list = [];
  String otpVerificationId = "";
  final _formKey = GlobalKey<FormState>();
  bool isOtpSent = false; //to swap between login & OTP screen
  bool isChecked = false; //Privacy policy checkbox value check
  // bool enableResend = false;
  String? phone, otp, countryCode, countryName, flagEmoji;
  int otpLength = 6;
  Timer? timer;
  int backPressedTimes = 0;
  int focusIndex = 0;
  late Size size;
  bool isOTPautofilled = false;
  ValueNotifier<int> otpResendTime = ValueNotifier<int>(
    Constant.otpResendSecond + 1,
  );
  TextEditingController otpController = TextEditingController();
  CountryService countryCodeService = CountryService();
  bool isLoginButtonDisabled = true;
  String otpIs = "";
  @override
  void initState() {
    super.initState();
    context.read<FetchSystemSettingsCubit>().fetchSettings(
          isAnonymouse: true,
        );
    mobileNumController.addListener(
      () {
        if (mobileNumController.text.isEmpty) {
          isLoginButtonDisabled = true;
          setState(() {});
        } else {
          isLoginButtonDisabled = false;
          setState(() {});
        }
      },
    );

    if (widget.isDeleteAccount ?? false) {
      sendVerificationCode(number: HiveUtils.getUserDetails().mobile);
      isOtpSent = true;
    }
    getSimCountry().then((value) {
      countryCode = value.phoneCode;
      flagEmoji = value.flagEmoji;
      setState(() {});
    });

    for (int i = 0; i < otpLength; i++) {
      final TextEditingController controller = TextEditingController();
      final FocusNode focusNode = FocusNode();
      _controllers.add(controller);
      _focusNodes.add(focusNode);
    }

    Future.delayed(Duration.zero, () {
      listenotp();
    });

    _controllers[otpLength - 1].addListener(() {
      if (isOTPautofilled) {
        _loginOnOTPFilled();
      }
    });
  }

  /// it will return user's sim cards country code
  Future<Country> getSimCountry() async {
    List<Country> countryList = countryCodeService.getAll();
    String? simCountryCode;

    try {
      simCountryCode = await FlutterSimCountryCode.simCountryCode;
    } catch (e) {
      log("--don't--remove");
    }

    Country simCountry = countryList.firstWhere(
      (element) {
        return element.phoneCode == simCountryCode;
      },
      orElse: () {
        return countryList
            .where(
              (element) => element.phoneCode == Constant.defaultCountryCode,
            )
            .first;
      },
    );

    if (Constant.isDemoModeOn) {
      simCountry = countryList
          .where((element) => element.phoneCode == Constant.demoCountryCode)
          .first;
    }

    return simCountry;
  }

  void listenotp() {
    final SmsAutoFill autoFill = SmsAutoFill();

    autoFill.code.listen((event) {
      if (isOtpSent) {
        Future.delayed(Duration.zero, () {
          for (int i = 0; i < _controllers.length; i++) {
            _controllers[i].text = event[i];
          }

          _focusNodes[focusIndex].unfocus();

          bool allFilled = true;
          for (int i = 0; i < _controllers.length; i++) {
            if (_controllers[i].text.isEmpty) {
              allFilled = false;
              break;
            }
          }

          // Call the API if all OTP fields are filled
          if (allFilled) {
            _loginOnOTPFilled();
          }

          if (mounted) setState(() {});
        });
      }
    });
  }

  void _loginOnOTPFilled() {
    onTapLogin();
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    if (timer != null) {
      timer!.cancel();
    }
    for (final FocusNode fNode in _focusNodes) {
      fNode.dispose();
    }
    otpResendTime.dispose();
    mobileNumController.dispose();
    if (isOtpSent) {
      SmsAutoFill().unregisterListener();
    }
    super.dispose();
  }

  void resendOTP() {
    if (isOtpSent) {
      context
          .read<SendOtpCubit>()
          .sendOTP(phoneNumber: "+${countryCode!}${mobileNumController.text}");
    }
  }

  void startTimer() async {
    timer?.cancel();
    timer = Timer.periodic(
      const Duration(seconds: 1),
      (Timer timer) {
        if (otpResendTime.value == 0) {
          timer.cancel();
          otpResendTime.value = Constant.otpResendSecond + 1;
          setState(() {});
        } else {
          otpResendTime.value--;
        }
      },
    );
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    size = MediaQuery.of(context).size;

    if (context.watch<FetchSystemSettingsCubit>().state
        is FetchSystemSettingsSuccess) {
      Constant.isDemoModeOn = context
          .watch<FetchSystemSettingsCubit>()
          .getSetting(SystemSetting.demoMode);
    }

    return SafeArea(
      child: AnnotatedRegion(
        value: SystemUiOverlayStyle(
          statusBarColor: context.color.tertiaryColor,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.light,
        ),
        child: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: WillPopScope(
            onWillPop: onBackPress,
            child: Scaffold(
              backgroundColor: context.color.backgroundColor,
              appBar: AppBar(
                backgroundColor: Colors.transparent,
                elevation: 0,
                automaticallyImplyLeading: false,
                leadingWidth: 100 + 14,
                leading: Builder(builder: (context) {
                  if (widget.popToCurrent == true) {
                    return const SizedBox.shrink();
                  }
                  return FittedBox(
                    fit: BoxFit.none,
                    child: MaterialButton(
                      color: context.color.secondaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                        side: BorderSide(
                            color: context.color.borderColor, width: 1.5),
                      ),
                      elevation: 0,
                      onPressed: () {
                        GuestChecker.set(isGuest: true);
                        HiveUtils.setIsGuest();
                        APICallTrigger.trigger();
                        HiveUtils.setUserIsNotNew();
                        Navigator.pushReplacementNamed(
                          context,
                          Routes.main,
                          arguments: {
                            "from": "login",
                            "isSkipped": true,
                          },
                        );
                      },
                      child: const Text("Skip"),
                    ),
                  );
                }),
                actions: [
                  if (!AppSettings.disableCountrySelection)
                    Visibility(
                      visible: !isOtpSent,
                      child: FittedBox(
                        fit: BoxFit.none,
                        child: GestureDetector(
                          onTap: () {
                            showCountryCode();
                          },
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: context.color.tertiaryColor
                                    .withOpacity(0.1),
                                child: Text(flagEmoji ?? ""),
                              ),
                              UiUtils.getSvg(
                                AppIcons.downArrow,
                                color: context.color.textLightColor,
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                ],
              ),
              body: buildLoginFields(context),
            ),
          ),
        ),
      ),
    );
  }

  Future<bool> onBackPress() {
    if (widget.isDeleteAccount ?? false) {
      Navigator.pop(context);
    } else {
      if (isOtpSent == true) {
        setState(() {
          isOtpSent = false;
        });
      } else {
        return Future.value(true);
      }
    }
    return Future.value(false);
  }

  Widget buildLoginFields(BuildContext context) {
    return BlocConsumer<DeleteAccountCubit, DeleteAccountState>(
      listener: (context, state) {
        if (state is AccountDeleted) {
          context.read<UserDetailsCubit>().clear();
          Future.delayed(const Duration(milliseconds: 500), () {
            Navigator.pushReplacementNamed(context, Routes.login);
          });
        }
      },
      builder: (context, state) {
        return ScrollConfiguration(
          behavior: RemoveGlow(),
          child: SingleChildScrollView(
              padding: EdgeInsetsDirectional.only(
                top: MediaQuery.of(context).padding.top + 40,
              ),
              child: BlocListener<LoginCubit, LoginState>(
                listener: (context, state) async {
                  if (state is LoginInProgress) {
                    Widgets.showLoader(context);
                  } else {
                    if (widget.isDeleteAccount ?? false) {
                    } else {
                      Widgets.hideLoder(context);
                    }
                  }
                  if (state is LoginFailure) {
                    HelperUtils.showSnackBarMessage(context, state.errorMessage,
                        type: MessageType.error);
                  }
                  if (state is LoginSuccess) {
                    FirebaseAnalytics analytics = FirebaseAnalytics.instance;
                    GuestChecker.set(isGuest: false);
                    HiveUtils.setIsNotGuest();
                    context
                        .read<UserDetailsCubit>()
                        .fill(HiveUtils.getUserDetails());

                    APICallTrigger.trigger();
                    analytics.setUserId(
                      id: HiveUtils.getUserDetails().id.toString(),
                    );
                    analytics.setUserProperty(
                        name: "id",
                        value: HiveUtils.getUserDetails().id.toString());
                    context
                        .read<FetchSystemSettingsCubit>()
                        .fetchSettings(isAnonymouse: false);
                    var settings = context.read<FetchSystemSettingsCubit>();

                    if (!const bool.fromEnvironment("force-disable-demo-mode",
                        defaultValue: false)) {
                      Constant.isDemoModeOn =
                          settings.getSetting(SystemSetting.demoMode) ?? false;
                    }
                    if (state.isProfileCompleted) {
                      HiveUtils.setUserIsAuthenticated();
                      HiveUtils.setUserIsNotNew();
                      context.read<AuthCubit>().updateFCM(context);
                      if (widget.popToCurrent == true) {
                        Navigator.pop(context);
                      } else {
                        Navigator.pushReplacementNamed(
                          context,
                          Routes.main,
                          arguments: {"from": "login"},
                        );
                      }
                    } else {
                      HiveUtils.setUserIsNotNew();
                      context.read<AuthCubit>().updateFCM(context);

                      if (widget.popToCurrent == true) {
                        //Navigate to Edit profile field
                        Navigator.pushNamed(
                          context,
                          Routes.completeProfile,
                          arguments: {
                            "from": "login",
                            "popToCurrent": widget.popToCurrent
                          },
                        );
                      } else {
                        //Navigate to Edit profile field
                        Navigator.pushReplacementNamed(
                          context,
                          Routes.completeProfile,
                          arguments: {
                            "from": "login",
                            "popToCurrent": widget.popToCurrent
                          },
                        );
                      }
                    }
                  }
                },
                child: BlocListener<DeleteAccountCubit, DeleteAccountState>(
                  listener: (context, state) {
                    if (state is DeleteAccountProgress) {
                      Widgets.hideLoder(context);
                      Widgets.showLoader(context);
                    }
                    if (state is AccountDeleted) {
                      Widgets.hideLoder(context);
                    }
                  },
                  child: BlocListener<VerifyOtpCubit, VerifyOtpState>(
                    listener: (context, state) {
                      if (state is VerifyOtpInProgress) {
                        Widgets.showLoader(context);
                      } else {
                        if (widget.isDeleteAccount ?? false) {
                        } else {
                          Widgets.hideLoder(context);
                        }
                      }
                      if (state is VerifyOtpFailure) {
                        HelperUtils.showSnackBarMessage(
                          context,
                          state.errorMessage,
                          type: MessageType.error,
                        );
                      }

                      if (state is VerifyOtpSuccess) {
                        if (widget.isDeleteAccount ?? false) {
                          context
                              .read<DeleteAccountCubit>()
                              .deleteUserAccount(context);
                        } else {
                          context.read<LoginCubit>().login(
                              phoneNumber: state.credential.user!.phoneNumber!,
                              fireabseUserId: state.credential.user!.uid,
                              countryCode: countryCode);
                        }
                      }
                    },
                    child: BlocListener<SendOtpCubit, SendOtpState>(
                      listener: (context, state) {
                        print("HERE STATE: $state");
                        if (state is SendOtpInProgress) {
                          Widgets.showLoader(context);
                        } else {
                          if (widget.isDeleteAccount ?? false) {
                          } else {
                            Widgets.hideLoder(context);
                          }
                        }

                        if (state is SendOtpSuccess) {
                          startTimer();
                          isOtpSent = true;
                          if (isOtpSent) {
                            HelperUtils.showSnackBarMessage(
                                context,
                                UiUtils.getTranslatedLabel(
                                    context, "optsentsuccessflly"),
                                type: MessageType.success);
                          }
                          otpVerificationId = state.verificationId;
                          setState(() {});

                          // context.read<SendOtpCubit>().setToInitial();
                        }
                        if (state is SendOtpFailure) {
                          HelperUtils.showSnackBarMessage(
                              context, state.errorMessage,
                              type: MessageType.error);
                        }
                      },
                      child: Form(
                        key: _formKey,
                        child: isOtpSent
                            ? buildOtpVerificationScreen()
                            : buildLoginScreen(),
                      ),
                    ),
                  ),
                ),
              )),
        );
      },
    );
  }

  Widget buildOtpVerificationScreen() {
    String demoOTP() {
      if (Constant.isDemoModeOn &&
          Constant.demoMobileNumber == mobileNumController.text) {
        return Constant.demoModeOTP; // If true, return the demo mode OTP.
      } else {
        return ""; // If false, return an empty string.
      }
    }

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(UiUtils.getTranslatedLabel(context, "enterCodeSend"))
                .size(context.font.xxLarge)
                .bold(weight: FontWeight.w700)
                .color(context.color.textColorDark),
            SizedBox(
              height: 15.rh(context),
            ),
            if (widget.isDeleteAccount ?? false) ...[
              Text("${UiUtils.getTranslatedLabel(context, "weSentCodeOnNumber")} +${HiveUtils.getUserDetails().mobile}")
                  .size(context.font.large)
                  .color(context.color.textColorDark.withOpacity(0.8)),
            ] else ...[
              Text("${UiUtils.getTranslatedLabel(context, "weSentCodeOnNumber")} +$countryCode${mobileNumController.text}")
                  .size(context.font.large)
                  .color(context.color.textColorDark.withOpacity(0.8)),
            ],
            SizedBox(
              height: 20.rh(context),
            ),
            PinFieldAutoFill(
              autoFocus: true,
              controller: otpController,
              textInputAction: TextInputAction.done,
              // cursor: Cursor(
              //
              //   color: context.color.teritoryColor,
              //   width: 2,
              //   enabled: true,
              //   height: context.font.extraLarge,
              // ),
              decoration: UnderlineDecoration(
                lineHeight: 1.5,
                colorBuilder: PinListenColorBuilder(
                  context.color.tertiaryColor,
                  Colors.grey,
                ),
              ),
              currentCode: demoOTP(),
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
              ],
              keyboardType: Platform.isIOS
                  ? const TextInputType.numberWithOptions(signed: true)
                  : const TextInputType.numberWithOptions(),
              onCodeSubmitted: (code) {
                if (widget.isDeleteAccount ?? false) {
                  context
                      .read<VerifyOtpCubit>()
                      .verifyOTP(verificationId: verificationID, otp: code);
                } else {
                  context
                      .read<VerifyOtpCubit>()
                      .verifyOTP(verificationId: otpVerificationId, otp: code);
                }
              },
              onCodeChanged: (code) {
                if (code?.length == 6) {
                  otpIs = code!;
                  // setState(() {});
                }
              },
            ),

            // loginButton(context),
            if (!(timer?.isActive ?? false)) ...[
              SizedBox(
                height: 70,
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: IgnorePointer(
                    ignoring: timer?.isActive ?? false,
                    child: setTextbutton(
                      UiUtils.getTranslatedLabel(context, "resendCodeBtnLbl"),
                      (timer?.isActive ?? false)
                          ? Theme.of(context).colorScheme.textLightColor
                          : Theme.of(context).colorScheme.tertiaryColor,
                      FontWeight.bold,
                      resendOTP,
                      context,
                    ),
                  ),
                ),
              ),
            ],

            Align(
              alignment: Alignment.centerLeft,
              child: SizedBox(child: resendOtpTimerWidget()),
            ),

            loginButton(context)
          ]),
    );
  }

  Widget buildLoginScreen() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(UiUtils.getTranslatedLabel(context, "enterYourNumber"))
                .size(context.font.xxLarge)
                .bold(weight: FontWeight.w700)
                .color(context.color.textColorDark),
            SizedBox(
              height: 15.rh(context),
            ),
            Text(UiUtils.getTranslatedLabel(context, "weSendYouCode"))
                .size(context.font.large)
                .color(context.color.textColorDark.withOpacity(0.8)),
            SizedBox(
              height: 41.rh(context),
            ),
            buildMobileNumberField(),
            SizedBox(
              height: size.height * 0.05,
            ),
            buildNextButton(context),
            SizedBox(
              height: 20.rh(context),
            ),
            buildTermsAndPrivacyWidget()
          ]),
    );
  }

  Widget resendOtpTimerWidget() {
    return ValueListenableBuilder(
        valueListenable: otpResendTime,
        builder: (context, value, child) {
          if (!(timer?.isActive ?? false)) {
            return const SizedBox.shrink();
          }
          String formatSecondsToMinutes(int seconds) {
            int minutes = seconds ~/ 60;
            int remainingSeconds = seconds % 60;
            return '$minutes:${remainingSeconds.toString().padLeft(2, '0')}';
          }

          return SizedBox(
            height: 70,
            child: Align(
              alignment: Alignment.centerLeft,
              child: RichText(
                  text: TextSpan(
                      text:
                          "${UiUtils.getTranslatedLabel(context, "resendMessage")} ",
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.textColorDark,
                          letterSpacing: 0.5),
                      children: <TextSpan>[
                    TextSpan(
                      text: formatSecondsToMinutes(int.parse(value.toString())),
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.tertiaryColor,
                          fontWeight: FontWeight.w400,
                          letterSpacing: 0.5),
                    ),
                    TextSpan(
                      text: UiUtils.getTranslatedLabel(
                        context,
                        "resendMessageDuration",
                      ),
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.tertiaryColor,
                          fontWeight: FontWeight.w400,
                          letterSpacing: 0.5),
                    ),
                  ])),
            ),
          );
        });
  }

  Widget buildMobileNumberField() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0),
      child: TextFormField(
        maxLength: 16,
        autofocus: true,
        buildCounter: (context,
            {required currentLength, required isFocused, maxLength}) {
          return const SizedBox.shrink();
        },
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: "0000000000",
          hintStyle: TextStyle(
              fontSize: context.font.xxLarge,
              color: context.color.textLightColor),
          prefixIcon: FittedBox(
            fit: BoxFit.scaleDown,
            child: Text("+" "$countryCode ").size(context.font.xxLarge),
          ),
        ),
        validator: ((value) {
          return Validator.validatePhoneNumber(value);
        }),
        onChanged: (String value) {
          setState(() {
            phone = "${countryCode!} $value";
          });
        },
        textAlignVertical: TextAlignVertical.center,
        style: TextStyle(fontSize: context.font.xxLarge),
        cursorColor: context.color.tertiaryColor,
        keyboardType: TextInputType.phone,
        controller: mobileNumController,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      ),
    );
  }

  void showCountryCode() {
    showCountryPicker(
      context: context,
      showWorldWide: false,
      showPhoneCode: true,
      countryListTheme: CountryListThemeData(
          borderRadius: BorderRadius.circular(11),
          backgroundColor: context.color.backgroundColor,
          inputDecoration: InputDecoration(
              prefixIcon: Icon(Icons.search),
              iconColor: context.color.tertiaryColor,
              prefixIconColor: context.color.tertiaryColor,
              focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: context.color.tertiaryColor)),
              floatingLabelStyle: TextStyle(color: context.color.tertiaryColor),
              labelText: "Search",
              border: OutlineInputBorder())),
      onSelect: (Country value) {
        flagEmoji = value.flagEmoji;
        countryCode = value.phoneCode;
        setState(() {});
      },
    );
  }

  Future<void> sendVerificationCode({String? number}) async {
    if (widget.isDeleteAccount ?? false) {
      context.read<SendOtpCubit>().sendOTP(phoneNumber: "+$number");
    }
    final form = _formKey.currentState;

    if (form == null) return;
    form.save();
    //checkbox value should be 1 before Login/SignUp
    if (form.validate()) {
      if (widget.isDeleteAccount ?? false) {
      } else {
        context.read<SendOtpCubit>().sendOTP(
            phoneNumber: "+${countryCode!}${mobileNumController.text}");
      }

      // firebaseLoginProcess();
    }
    // showSnackBar( UiUtils.getTranslatedLabel(context, "acceptPolicy"), context);
  }

  Future<void> onTapLogin() async {
    if (otpIs.length < otpLength) {
      HelperUtils.showSnackBarMessage(
          context, UiUtils.getTranslatedLabel(context, "lblEnterOtp"),
          messageDuration: 2);
      return;
    }

    if (widget.isDeleteAccount ?? false) {
      context
          .read<VerifyOtpCubit>()
          .verifyOTP(verificationId: verificationID, otp: otpIs);
    } else {
      context
          .read<VerifyOtpCubit>()
          .verifyOTP(verificationId: otpVerificationId, otp: otpIs);
    }
  }

  Widget buildNextButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0),
      child: buildButton(
        context,
        buttonTitle: UiUtils.getTranslatedLabel(context, "next"),
        disabled: isLoginButtonDisabled,
        onPressed: () {
          sendVerificationCode();
        },
      ),
    );
  }

  Widget buildLoginButton(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 0),
        child: buildButton(
          context,
          buttonTitle: UiUtils.getTranslatedLabel(context, "next"),
          onPressed: () {
            sendVerificationCode();
          },
        ));
  }

  Widget buildButton(BuildContext context,
      {double? height,
      double? width,
      required VoidCallback onPressed,
      bool? disabled,
      required String buttonTitle}) {
    return MaterialButton(
      minWidth: width ?? double.infinity,
      height: height ?? 56.rh(context),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0.5,
      color: context.color.tertiaryColor,
      disabledColor: context.color.textLightColor,
      onPressed: (disabled != true)
          ? () {
              HelperUtils.unfocus();
              onPressed.call();
            }
          : null,
      child: Text(buttonTitle)
          .color(context.color.buttonColor)
          .size(context.font.larger),
    );
  }

  Widget loginButton(BuildContext context) {
    return buildButton(
      context,
      onPressed: onTapLogin,
      buttonTitle: UiUtils.getTranslatedLabel(
        context,
        "comfirmBtnLbl",
      ),
    );
  }

//otp
  Widget buildTermsAndPrivacyWidget() {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        padding: const EdgeInsetsDirectional.only(top: 0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            RichText(
              textAlign: TextAlign.center,
              text: TextSpan(children: [
                TextSpan(
                  text:
                      "${UiUtils.getTranslatedLabel(context, "policyAggreementStatement")}\n",
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).colorScheme.textColorDark,
                      ),
                ),
                TextSpan(
                  text: UiUtils.getTranslatedLabel(context, "termsConditions"),
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(context).colorScheme.tertiaryColor,
                      decoration: TextDecoration.underline,
                      fontWeight: FontWeight.w600),
                  recognizer: TapGestureRecognizer()
                    ..onTap = (() {
                      HelperUtils.goToNextPage(
                        Routes.profileSettings,
                        context,
                        false,
                        args: {
                          'title': UiUtils.getTranslatedLabel(
                              context, "termsConditions"),
                          'param': Api.termsAndConditions
                        },
                      );
                    }),
                ),
                TextSpan(
                  text: " ${UiUtils.getTranslatedLabel(context, "and")} ",
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).colorScheme.textColorDark,
                      ),
                ),
                TextSpan(
                  text: UiUtils.getTranslatedLabel(context, "privacyPolicy"),
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(context).colorScheme.tertiaryColor,
                      decoration: TextDecoration.underline,
                      fontWeight: FontWeight.w600),
                  recognizer: TapGestureRecognizer()
                    ..onTap = (() {
                      HelperUtils.goToNextPage(
                          Routes.profileSettings, context, false,
                          args: {
                            'title': UiUtils.getTranslatedLabel(
                                context, "privacyPolicy"),
                            'param': Api.privacyPolicy
                          });
                    }),
                ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
