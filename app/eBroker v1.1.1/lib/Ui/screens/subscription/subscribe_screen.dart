// ignore_for_file: must_be_immutable, depend_on_referenced_packages

import 'dart:io';

import 'package:ebroker/app/app.dart';
import 'package:ebroker/app/default_app_setting.dart';
import 'package:ebroker/data/model/subscription_pacakage_model.dart';
import 'package:ebroker/utils/AppIcon.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/api.dart';
import 'package:ebroker/utils/hive_utils.dart';
import 'package:ebroker/utils/payment/gatways/paypal.dart';
import 'package:ebroker/utils/responsiveSize.dart';
import 'package:ebroker/utils/ui_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_paystack/flutter_paystack.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../data/cubits/subscription/fetch_subscription_packages_cubit.dart';
import '../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../utils/constant.dart';
import '../../../utils/helper_utils.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';
import '../widgets/blurred_dialoge_box.dart';

/////THIS SCREEN IS NOT IN USE NOW

class SubscriptionScreen extends StatefulWidget {
  SubscriptionPackageModel pacakge;
  final bool isPackageAlready;
  SubscriptionScreen(
      {super.key, required this.pacakge, required this.isPackageAlready});
  static Route route(RouteSettings settings) {
    Map arguments = settings.arguments as Map;
    return BlurredRouter(
      builder: (context) {
        return SubscriptionScreen(
          pacakge: arguments['package'],
          isPackageAlready: arguments['isPackageAlready'],
        );
      },
    );
  }

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  PaystackPlugin paystackPlugin = PaystackPlugin();
  final Razorpay _razorpay = Razorpay();
  int selectedPaymentMethod = 1;
  late WebViewController controllerGlobal;
  late Map<int, VoidCallback> paymentMethodIndex = {
    1: _paystack,
    2: _openPaypal,
    3: _openRazorPay
  };

  _openPaypal() {
    Navigator.push<dynamic>(context, BlurredRouter(
      builder: (context) {
        return PaypalWidget(
          pacakge: widget.pacakge,
          onSuccess: (msg) {
            Navigator.pop(
              context,
              {
                "msg": msg,
                "type": "success",
              },
            );
          },
          onFail: (msg) {
            Navigator.pop(
              context,
              {
                "msg": msg,
                "type": "fail",
              },
            );
          },
        );
      },
    )).then((dynamic value) {
      //push and show dialog box about paypal success or failed, after that we call purchase method it will refresh API and check if package is purchased or not
      if (value != null) {
        Future.delayed(
          const Duration(milliseconds: 1000),
          () {
            UiUtils.showBlurredDialoge(context,
                dialoge: BlurredDialogBox(
                    title: UiUtils.getTranslatedLabel(context,
                        value['type'] == 'success' ? "success" : "Failed"),
                    onAccept: () async {
                      if (value['type'] == 'success') {
                        _purchase();
                      }
                    },
                    onCancel: () {
                      if (value['type'] == 'success') {
                        _purchase();
                      }
                    },
                    isAcceptContainesPush: true,
                    content: Text(value['msg'])));
          },
        );
      }
    });
  }

  _purchase() async {
    try {
      Future.delayed(
        Duration.zero,
        () {
          context
              .read<FetchSystemSettingsCubit>()
              .fetchSettings(isAnonymouse: false);
          context.read<FetchSubscriptionPackagesCubit>().fetchPackages();

          HelperUtils.showSnackBarMessage(
              context, UiUtils.getTranslatedLabel(context, "success"),
              type: MessageType.success, messageDuration: 5);

          Navigator.of(context).popUntil((route) => route.isFirst);
        },
      );
    } catch (e) {
      HelperUtils.showSnackBarMessage(context, "purchaseFailed",
          type: MessageType.error);
    }
  }

  getPaypalURL() async {
    await Api.get(url: Api.paypal, queryParameters: {
      Api.packageId: widget.pacakge.id,
      "amount": widget.pacakge.price.toString()
    });
  }

  _openRazorPay() async {
    var options = {
      'key': Constant.razorpayKey,
      'amount': widget.pacakge.price! * 100,
      'name': widget.pacakge.name,
      'description': '',
      'prefill': {
        'contact': HiveUtils.getUserDetails().mobile,
        'email': HiveUtils.getUserDetails().email
      },
      "notes": {
        "package_id": widget.pacakge.id,
        "user_id": HiveUtils.getUserId()
      },
    };

    if (Constant.razorpayKey != "") {
      _razorpay.open(options);
      _razorpay.on(
        Razorpay.EVENT_PAYMENT_SUCCESS,
        _razorpayHandlePaymentSuccess,
      );
      _razorpay.on(
        Razorpay.EVENT_PAYMENT_ERROR,
        _razorpayHandlePaymentError,
      );
      _razorpay.on(
        Razorpay.EVENT_EXTERNAL_WALLET,
        _razorpayHandleExternalWallet,
      );
    } else {
      HelperUtils.showSnackBarMessage(
          context, UiUtils.getTranslatedLabel(context, "setAPIkey"));
    }
  }

  _paystack() async {
    Charge paystackCharge = Charge()
      ..amount = (widget.pacakge.price! * 100).toInt()
      ..email = HiveUtils.getUserDetails().email
      ..currency = Constant.paystackCurrency
      ..reference = generateReference(HiveUtils.getUserDetails().email!)
      ..putMetaData("username", HiveUtils.getUserDetails().name)
      ..putMetaData("package_id", widget.pacakge.id)
      ..putMetaData("user_id", HiveUtils.getUserId());

    CheckoutResponse checkoutResponse = await paystackPlugin.checkout(context,
        logo: SizedBox(
            height: 50,
            width: 50,
            child: LoadAppSettings().svg(appSettings.placeholderLogo!,
                color: context.color.tertiaryColor)),
        charge: paystackCharge,
        method: CheckoutMethod.card);

    if (checkoutResponse.status) {
      if (checkoutResponse.verify) {
        await _purchase();
      }
    } else {
      Future.delayed(
        Duration.zero,
        () {
          HelperUtils.showSnackBarMessage(context, "purchaseFailed");
        },
      );
    }
  }

  String generateReference(String email) {
    late String platform;
    if (Platform.isIOS) {
      platform = 'I';
    } else if (Platform.isAndroid) {
      platform = 'A';
    }
    String reference =
        '${platform}_${email.split("@").first}_${DateTime.now().millisecondsSinceEpoch}';
    return reference;
  }

  _onTapSubscribe() async {
    paymentMethodIndex[selectedPaymentMethod]?.call();
  }

  @override
  void initState() {
    paystackPlugin.initialize(publicKey: Constant.paystackKey);
    super.initState();
  }

  void _razorpayHandlePaymentSuccess(PaymentSuccessResponse response) async {
    await _purchase();
  }

  void _razorpayHandlePaymentError(PaymentFailureResponse response) {
    HelperUtils.showSnackBarMessage(context, "purchaseFailed");
  }

//not in use
  void _razorpayHandleExternalWallet(ExternalWalletResponse response) {}
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.color.primaryColor,
      appBar: UiUtils.buildAppBar(context,
          showBackButton: true,
          title: UiUtils.getTranslatedLabel(context, "selectPaymentMethod")),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          ScrollConfiguration(
            behavior: RemoveGlow(),
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              shrinkWrap: true,
              children: <Widget>[
                RadioListTile(
                  title: Text(
                    UiUtils.getTranslatedLabel(
                      context,
                      "paystack",
                    ),
                  ),
                  activeColor: context.color.tertiaryColor,
                  secondary: paymentIcon(context, AppIcons.paystack),
                  controlAffinity: ListTileControlAffinity.trailing,
                  value: 1,
                  groupValue: selectedPaymentMethod,
                  onChanged: (dynamic v) {
                    selectedPaymentMethod = v;
                    setState(
                      () {},
                    );
                  },
                ),
                const SizedBox(
                  height: 5,
                ),
                RadioListTile(
                    title: Text(
                      UiUtils.getTranslatedLabel(context, "paypal"),
                    ),
                    activeColor: context.color.tertiaryColor,
                    secondary: paymentIcon(
                      context,
                      AppIcons.paypal,
                    ),
                    controlAffinity: ListTileControlAffinity.trailing,
                    value: 2,
                    groupValue: selectedPaymentMethod,
                    onChanged: (dynamic v) {
                      selectedPaymentMethod = v;
                      setState(() {});
                    }),
                const SizedBox(
                  height: 5,
                ),
                RadioListTile(
                    title: Text(
                      UiUtils.getTranslatedLabel(context, "razorpay"),
                    ),
                    activeColor: context.color.tertiaryColor,
                    secondary: paymentIcon(context, AppIcons.razorpay),
                    controlAffinity: ListTileControlAffinity.trailing,
                    value: 3,
                    groupValue: selectedPaymentMethod,
                    onChanged: (dynamic v) {
                      selectedPaymentMethod = v;
                      setState(() {});
                    }),
              ],
            ),
          ),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: UiUtils.buildButton(context,
                onPressed: _onTapSubscribe,
                radius: 12,
                height: 48.rh(context),
                buttonTitle: UiUtils.getTranslatedLabel(context, "subscribe")),
          )
        ],
      ),
    );
  }

  Widget paymentIcon(BuildContext context, String icon) {
    return Container(
      width: 60.rw(context),
      height: 41.rh(context),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5),
        color: const Color(0xff072654),
      ),
      child: UiUtils.getSvg(icon, fit: BoxFit.none),
    );
  }

  Widget buildPackageTile(
      BuildContext context, SubscriptionPackageModel subscriptionPacakge) {
    return Container(
      color: Theme.of(context).colorScheme.tertiaryColor,
      width: context.screenWidth,
      height: 160,
      child: Padding(
        padding: const EdgeInsets.all(25.0),
        child: Row(
          children: <Widget>[
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Text(subscriptionPacakge.name.toString())
                      .bold(weight: FontWeight.w600)
                      .size(24)
                      .color(
                        Theme.of(context).colorScheme.backgroundColor,
                      ),
                  Text("Validity:${subscriptionPacakge.duration.toString()}")
                      .bold(weight: FontWeight.w600)
                      .color(
                        Theme.of(context).colorScheme.backgroundColor,
                      ),
                ],
              ),
            ),
            Text("${Constant.currencySymbol}${subscriptionPacakge.price}")
                .size(35)
                .color(Theme.of(context).colorScheme.backgroundColor)
          ],
        ),
      ),
    );
  }
}
