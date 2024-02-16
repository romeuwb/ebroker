import '../../../utils/Extensions/extensions.dart';
import '../../../utils/constant.dart';
import '../../../utils/ui_utils.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import 'AnimatedRoutes/blur_page_route.dart';

class MaintenanceMode extends StatelessWidget {
  const MaintenanceMode({super.key});
  static Route route(RouteSettings settings) {
    return BlurredRouter(
      builder: (context) {
        return const MaintenanceMode();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.color.primaryColor,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Lottie.asset(
            "assets/lottie/${Constant.maintenanceModeLottieFile}",
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
                    UiUtils.getTranslatedLabel(
                        context, "maintenanceModeMessage"),
                    textAlign: TextAlign.center)
                .color(context.color.textColorDark),
          )
        ],
      ),
    );
  }
}
