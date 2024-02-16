// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:io';

import 'package:ebroker/app/app.dart';
import 'package:ebroker/app/default_app_setting.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_paystack/flutter_paystack.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

import '../../../data/cubits/subscription/fetch_subscription_packages_cubit.dart';
import '../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../settings.dart';
import '../../../utils/constant.dart';
import '../../../utils/helper_utils.dart';
import '../../../utils/hive_utils.dart';
import '../../../utils/payment/gatways/paypal.dart';
import '../../../utils/payment/gatways/stripe_service.dart';
import '../../../utils/ui_utils.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';
import '../widgets/blurred_dialoge_box.dart';

class PaymentGatways {
  static PaystackPlugin paystackPlugin = PaystackPlugin();

  static openEnabled(BuildContext context, dynamic price, dynamic package) {
    if (AppSettings.enabledPaymentGatway == "paystack") {
      paystack(context, price, package.id);
    } else if (AppSettings.enabledPaymentGatway == "paypal") {
      paypal(context, package);
    } else if (AppSettings.enabledPaymentGatway == "razorpay") {
      razorpay(context, price: price, package: package);
    } else if (AppSettings.enabledPaymentGatway == "stripe") {
      stripe(context,
          packageId: package, price: double.parse(price.toString()));
    }
  }

  static String generateReference(String email) {
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

  static void initPaystack() {
    if (AppSettings.enabledPaymentGatway == "paystack") {
      if (!paystackPlugin.sdkInitialized) {
        paystackPlugin.initialize(publicKey: Constant.paystackKey);
      }
    }
  }

  static void stripe(BuildContext context,
      {required double price, required dynamic packageId}) {
    openStripePaymentGateway(
        amount: price,
        onError: (message) {},
        onSuccess: () {
          _purchase(context);
        },
        metadata: {"packageId": packageId.id, "userId": HiveUtils.getUserId()});
  }

  static Future<void> paystack(
      BuildContext context, dynamic price, dynamic packageId) async {
    Charge paystackCharge = Charge()
      ..amount = (price! * 100).toInt()
      ..email = HiveUtils.getUserDetails().email
      ..currency = Constant.paystackCurrency
      ..reference = generateReference(HiveUtils.getUserDetails().email!)
      ..putMetaData("username", HiveUtils.getUserDetails().name)
      ..putMetaData("package_id", packageId)
      ..putMetaData("user_id", HiveUtils.getUserId());

    CheckoutResponse checkoutResponse = await paystackPlugin.checkout(context,
        logo: SizedBox(
            height: 50,
            width: 50,
            child: LoadAppSettings().svg(
              appSettings.splashLogo!,
            )),
        charge: paystackCharge,
        method: CheckoutMethod.card);

    if (checkoutResponse.status) {
      if (checkoutResponse.verify) {
        Future.delayed(
          Duration.zero,
          () async {
            await _purchase(context);
          },
        );
      }
    } else {
      Future.delayed(
        Duration.zero,
        () {
          HelperUtils.showSnackBarMessage(
              context, UiUtils.getTranslatedLabel(context, "purchaseFailed"));
        },
      );
    }
  }

  static void paypal(BuildContext context, dynamic package) {
    Navigator.push<dynamic>(context, BlurredRouter(
      builder: (context) {
        return PaypalWidget(
          pacakge: package,
          onSuccess: (msg) {
            Navigator.pop(context, {"msg": msg, "type": "success"});
          },
          onFail: (msg) {
            Navigator.pop(context, {"msg": msg, "type": "fail"});
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
                        _purchase(context);
                      }
                    },
                    onCancel: () {
                      if (value['type'] == 'success') {
                        _purchase(context);
                      }
                    },
                    isAcceptContainesPush: true,
                    content: Text(value['msg'])));
          },
        );
      }
    });
  }

  static void razorpay(
    BuildContext context, {
    required price,
    required package,
  }) {
    final Razorpay razorpay = Razorpay();

    var options = {
      'key': Constant.razorpayKey,
      'amount': price! * 100,
      'name': package.name,
      'description': '',
      'prefill': {
        'contact': HiveUtils.getUserDetails().mobile,
        'email': HiveUtils.getUserDetails().email
      },
      "notes": {"package_id": package.id, "user_id": HiveUtils.getUserId()},
    };

    if (Constant.razorpayKey != "") {
      razorpay.open(options);
      razorpay.on(
        Razorpay.EVENT_PAYMENT_SUCCESS,
        (
          PaymentSuccessResponse response,
        ) async {
          await _purchase(context);
        },
      );
      razorpay.on(
        Razorpay.EVENT_PAYMENT_ERROR,
        (PaymentFailureResponse response) {
          HelperUtils.showSnackBarMessage(
              context, UiUtils.getTranslatedLabel(context, "purchaseFailed"));
        },
      );
      razorpay.on(
        Razorpay.EVENT_EXTERNAL_WALLET,
        (e) {},
      );
    } else {
      HelperUtils.showSnackBarMessage(
          context, UiUtils.getTranslatedLabel(context, "setAPIkey"));
    }
  }

  static Future<void> _purchase(BuildContext context) async {
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
      HelperUtils.showSnackBarMessage(
          context, UiUtils.getTranslatedLabel(context, "purchaseFailed"),
          type: MessageType.error);
    }
  }
}

// class PaymentService {
//   BuildContext? _context;
//   SubscriptionPackageModel? _modal;
//   String? _targetGatwayKey;
//   Gatway? _currentGatway;
//   set targetGatwayKey(String key) {
//     _targetGatwayKey = key;
//   }

//   PaymentService setPackage(SubscriptionPackageModel modal) {
//     _modal = modal;
//     return this;
//   }

//   PaymentService setContext(BuildContext context) {
//     _context = context;
//     return this;
//   }

//   PaymentService attachedGatways(List<Gatway> paymentGatways) {
//     if (_targetGatwayKey == null) {
//       throw "Please set target gatway key";
//     }
//     for (Gatway gatway in paymentGatways) {
//       if (gatway.key == _targetGatwayKey) {
//         _currentGatway = gatway;
//       }
//     }
//     return this;
//   }

//   void pay() async {
//     if (_context == null) {
//       throw "Please call setContext before use this";
//     }
//     if (_modal == null) {
//       throw "Please call setPackage";
//     }
//     if (_currentGatway == null) {
//       throw "please attach gatways";
//     }
//     _currentGatway!.instance.setPackage(_modal!).pay(_context!);
//   }
// }
