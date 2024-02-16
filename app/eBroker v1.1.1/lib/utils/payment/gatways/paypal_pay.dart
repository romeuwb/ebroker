import 'package:ebroker/Ui/screens/widgets/AnimatedRoutes/blur_page_route.dart';
import 'package:ebroker/data/model/subscription_pacakage_model.dart';
import 'package:ebroker/utils/payment/gatways/paypal.dart';
import 'package:ebroker/utils/payment/lib/payment.dart';
import 'package:ebroker/utils/payment/lib/purchase_package.dart';
import 'package:ebroker/utils/ui_utils.dart';
import 'package:flutter/material.dart';

import '../../../Ui/screens/widgets/blurred_dialoge_box.dart';

class Paypal extends Payment {
  SubscriptionPackageModel? _modal;
  @override
  void pay(BuildContext context) {
    if (_modal == null) {
      throw "Please set modal";
    }

    Navigator.push<dynamic>(context, BlurredRouter(
      builder: (context) {
        return PaypalWidget(
          pacakge: _modal!,
          onSuccess: (msg) {
            Navigator.pop(context, {
              "msg": msg,
              "type": "success",
            });
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
                        emit(Success(message: "Success"));
                        // _purchase(context);
                      }
                      if (value['type'] == "Failed") {
                        emit(Failure(
                            message:
                                "Something went wrong while making payment"));
                      }
                    },
                    onCancel: () {
                      if (value['type'] == 'success') {
                        emit(Success(message: "Success"));
                      }
                      if (value['type'] == "Failed") {
                        emit(Failure(
                            message:
                                "Something went wrong while making payment"));
                      }
                    },
                    isAcceptContainesPush: true,
                    content: Text(value['msg'])));
          },
        );
      }
    });
  }

  @override
  Paypal setPackage(SubscriptionPackageModel modal) {
    _modal = modal;
    return this;
  }

  @override
  void onEvent(
      BuildContext context, covariant PaymentStatus currentStatus) async {
    if (currentStatus is Success) {
      await PurchasePackage().purchase(context);
    }
  }
}
