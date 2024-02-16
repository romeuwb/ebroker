// ignore_for_file: public_member_api_docs, sort_constructors_firstutils/Extensions/extensions.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/constant.dart';
import 'package:ebroker/utils/responsiveSize.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../../../../utils/AppIcon.dart';
import '../../../../utils/LiquidIndicator/src/liquid_circular_progress_indicator.dart';
import '../../../../utils/ui_utils.dart';

class CurrentPackageTileCard extends StatefulWidget {
  final String name;
  final dynamic advertismentLimit;
  final dynamic propertyLimit;
  final dynamic duration;
  final dynamic startDate;
  final String startDay;
  final dynamic endDate;
  final dynamic advertismentRemining;
  final dynamic propertyRemining;
  final String price;
  const CurrentPackageTileCard({
    super.key,
    required this.advertismentLimit,
    required this.propertyLimit,
    required this.duration,
    required this.startDate,
    required this.endDate,
    required this.advertismentRemining,
    required this.propertyRemining,
    required this.price,
    required this.name,
    required this.startDay,
  });

  @override
  State<CurrentPackageTileCard> createState() => _CurrentPackageTileCardState();
}

class _CurrentPackageTileCardState extends State<CurrentPackageTileCard> {
  String endDate = "";
  bool isLifeTimeValidity = false;
  String endDay = "";
  dynamic ifServiceUnlimited(int limit, {dynamic remining}) {
    if (limit == 0) {
      return UiUtils.getTranslatedLabel(context, "unlimited");
    }
    if (remining != null) {
      return "";
    }

    return limit;
  }

  int? getDaysRemining() {
    if (widget.endDate != null) {
      DateTime currentDate = DateTime.now();
      Duration remainingDuration =
          DateTime.parse(widget.endDate).difference(currentDate);
      int daysLeft = remainingDuration.inDays;
      return daysLeft;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    if (widget.endDate != null) {
      endDate = widget.endDate.toString().formatDate(format: "d MMM yyyy");
      endDay = widget.endDate.toString().formatDate(format: "EEEE");
    }
    isLifeTimeValidity = widget.endDate == null;

    return Container(
      decoration: BoxDecoration(
          color: context.color.secondaryColor,
          borderRadius: BorderRadius.circular(18)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          buildCurvePatternWidget(context),
          const SizedBox(
            height: 5,
          ),
          buildPriceAndTitleWidget(context),
          buildValidityWidget(context),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                LiquidProgressContainer(
                  title: "property".translate(context),
                  countRemining: widget.propertyRemining,
                  countLimit: widget.propertyLimit,
                ),
                LiquidProgressContainer(
                  title: "advertisement".translate(context),
                  countRemining: widget.advertismentRemining,
                  countLimit: widget.advertismentLimit,
                ),
                LiquidProgressContainer(
                  title: "daysRemining".translate(context),
                  countRemining: (getDaysRemining() ?? 0).toString(),
                  countLimit: widget.duration,
                  isValidity: true,
                  validityCount: widget.duration.toString(),
                ),
              ],
            ),
          ),
          if (isLifeTimeValidity)
            const SizedBox(
              height: 6,
            ),
          if (!isLifeTimeValidity)
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16.0, 5, 16, 16),
              child: Row(
                children: [
                  Expanded(
                      child: DateCard(
                    title: "startedOn".translate(context),
                    day: widget.startDay,
                    date: widget.startDate,
                  )),
                  const SizedBox(
                    width: 16,
                  ),
                  Expanded(
                    child: DateCard(
                      day: endDay,
                      title: "willEndOn".translate(context),
                      date: endDate,
                    ),
                  ),
                ],
              ),
            )
        ],
      ),
    );
  }

  Stack buildCurvePatternWidget(BuildContext context) {
    return Stack(
      children: [
        SizedBox(
          width: context.screenWidth,
          child: UiUtils.getSvg(AppIcons.headerCurve,
              color: context.color.tertiaryColor, fit: BoxFit.fitWidth),
        ),
        PositionedDirectional(
          start: 10.rw(context),
          top: 8.rh(context),
          child: Text(UiUtils.getTranslatedLabel(context, "currentPackage"))
              .size(context.font.larger)
              .color(context.color.secondaryColor)
              .bold(weight: FontWeight.w600),
        )
      ],
    );
  }

  Padding buildPriceAndTitleWidget(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: SizedBox(
              child: Text(widget.name)
                  .size(context.font.larger)
                  .color(context.color.textColorDark)
                  .bold(weight: FontWeight.w600),
            ),
          ),
          const SizedBox(
            width: 5,
          ),
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Text(
                      "price".translate(context),
                      style: const TextStyle(
                          textBaseline: TextBaseline.alphabetic),
                    ).size(context.font.small).bold(weight: FontWeight.w300),
                    const SizedBox(
                      height: 5,
                    ),
                    buildPriceWidget(context)
                  ],
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget buildPriceWidget(BuildContext context) {
    return Row(
      children: [
        Text(
          Constant.currencySymbol,
          style: const TextStyle(
            height: 0.6,
          ),
        ).color(context.color.tertiaryColor).size(context.font.larger),
        Text(
          widget.price,
          style: const TextStyle(
            height: 0.6,
          ),
        ).size(context.font.larger).bold(weight: FontWeight.w500)
      ],
    );
  }

  Widget buildValidityWidget(BuildContext context) {
    dynamic getDays() {
      if (widget.duration == null ||
          widget.duration == 0.toString() ||
          widget.duration == 0) {
        return "lifetime".translate(context);
      } else {
        return widget.duration;
      }
    }

    bool isLifetime() {
      if (widget.duration == null ||
          widget.duration == 0.toString() ||
          widget.duration == 0) {
        return true;
      } else {
        return false;
      }
    }

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 10),
      child: Text(
              "${"packageValidity".translate(context)} ${getDays()} ${isLifetime() ? "" : "days".translate(context)}")
          .size(context.font.large),
    );
  }
}

class DateCard extends StatelessWidget {
  final String title;
  final String date;
  final String day;
  const DateCard(
      {super.key, required this.title, required this.date, required this.day});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title),
        Container(
          height: 53,
          decoration: BoxDecoration(
            color: context.color.tertiaryColor,
            borderRadius: BorderRadius.circular(4),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SvgPicture.asset(
                  AppIcons.calender,
                  width: 26,
                  height: 26,
                  color: context.color.buttonColor,
                ),
                const SizedBox(
                  width: 10,
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(day).color(context.color.buttonColor),
                      Text(
                        date,
                        style: const TextStyle(
                          fontWeight: FontWeight.w200,
                        ),
                      ).color(context.color.buttonColor)
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class LiquidProgressContainer extends StatelessWidget {
  final String title;
  final String countRemining;
  final dynamic countLimit;
  final bool? isValidity;
  final String? validityCount;
  const LiquidProgressContainer(
      {super.key,
      required this.title,
      required this.countRemining,
      required this.countLimit,
      this.isValidity,
      this.validityCount});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(title).size(context.font.normal),
        const SizedBox(
          height: 7,
        ),
        getLiquidProgress(context,
            count: (isValidity == true) ? validityCount : null)
      ],
    );
  }

  Widget getLiquidProgress(BuildContext context, {String? count}) {
    String? getCount() {
      String filterdCount = "$countRemining/$countLimit";
      if (isValidity == true) {
        // if (count == null || count == 0.toString()) {
        //   return "--".translate(context);
        // }

        if (countRemining == "0") {
          return "--";
        }
        return "$countRemining ${"days".translate(context)}";
      }
      if (countLimit == 0) {
        return "unlimited".translate(context);
      }

      if (countLimit == null) {
        return "✕";
      }

      return filterdCount;
    }

    double getValue() {
      double result = 0;

      if (isValidity == true) {
        result = 1 - (double.parse(countRemining) / countLimit);
      } else if (countLimit == 0 || countRemining == "--") {
        result = 0;
      } else {
        if (countLimit == null) {
          result = 0;
        } else {
          result = double.parse(countRemining) / countLimit;
        }
      }

      if (result.isNaN) {
        return 0;
      }

      return result;
    }

    return SizedBox(
      width: 60,
      height: 60,
      child: LiquidCircularProgressIndicator(
        value: getValue(),
        valueColor: AlwaysStoppedAnimation(
          context.color.tertiaryColor.withOpacity(0.3),
        ),
        backgroundColor: context.color.secondaryColor,
        borderColor: context.color.tertiaryColor,
        borderWidth: 3.0,
        direction: Axis.vertical,
        center: Padding(
          padding: const EdgeInsets.all(5.0),
          child: FittedBox(
              fit: BoxFit.fitWidth,
              child: Text(getCount() ?? "").size(context.font.small)),
        ),
      ),
    );
  }
}
