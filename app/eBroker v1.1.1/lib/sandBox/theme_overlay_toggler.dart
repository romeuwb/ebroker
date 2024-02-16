import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../data/cubits/system/app_theme_cubit.dart';

class ThemeToggler {
  void addTool(context) async {
    OverlayState? overlayState = Overlay.of(context);
    OverlayEntry overlayEntry;
    overlayEntry = OverlayEntry(builder: (context) {
      return const ThemeOverlayToggler();
    });
    SchedulerBinding.instance.addPostFrameCallback((timeStamp) {
      overlayState.insert(overlayEntry);
    });
  }
}

class ThemeOverlayToggler extends StatefulWidget {
  const ThemeOverlayToggler({super.key});

  @override
  State<ThemeOverlayToggler> createState() => ThemeOverlayTogglerState();
}

class ThemeOverlayTogglerState extends State<ThemeOverlayToggler> {
  double x = 50;
  double y = 50;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: y,
      left: x,
      child: Material(
        textStyle: const TextStyle(decoration: TextDecoration.none),
        child: Draggable(
          onDragUpdate: (d) {
            x = d.globalPosition.dx;
            y = d.globalPosition.dy;
            setState(() {});
          },
          feedbackOffset: const Offset(-1, 0),
          feedback: Container(),
          child: InkWell(
            onTap: () {
              context.read<AppThemeCubit>().toggleTheme();
            },
            child: Container(
              height: 50,
              color: const Color.fromARGB(255, 85, 40, 65),
              child: const Center(
                  child: Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "Change Theme",
                  style: TextStyle(color: Colors.white),
                ),
              )),
            ),
          ),
        ),
      ),
    );
  }
}
