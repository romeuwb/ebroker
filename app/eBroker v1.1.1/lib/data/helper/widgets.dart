import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../utils/Extensions/extensions.dart';
import '../../utils/ui_utils.dart';

class Widgets {
  static void showLoader(BuildContext context) async {
    showDialog(
        context: context,
        barrierDismissible: false,
        useSafeArea: true,
        builder: (BuildContext context) {
          return AnnotatedRegion(
            value: SystemUiOverlayStyle(
              statusBarColor: Colors.black.withOpacity(0),
            ),
            child: SafeArea(
              child: WillPopScope(
                child: Center(
                  child: UiUtils.progress(
                    normalProgressColor: context.color.tertiaryColor,
                  ),
                ),
                onWillPop: () {
                  return Future(
                    () => false,
                  );
                },
              ),
            ),
          );
        });
  }

  static void hideLoder(BuildContext context) {
    Navigator.of(context).pop();
  }

  static Center noDataFound(String errorMsg) {
    return Center(child: Text(errorMsg));
  }
}

//string Extension -- for ₹
extension FormatAmount on String {
  //working with static strings and not textFormField
}
