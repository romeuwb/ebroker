import 'package:ebroker/Ui/screens/subscription/widget/current_package_card.dart';
import 'package:ebroker/data/cubits/subscription/assign_free_package.dart';
import 'package:ebroker/data/helper/widgets.dart';
import 'package:ebroker/utils/api.dart';
import 'package:ebroker/utils/helper_utils.dart';
import 'package:ebroker/utils/payment/lib/list_gatways.dart';
import 'package:ebroker/utils/payment/lib/payment_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../../data/cubits/subscription/fetch_subscription_packages_cubit.dart';
import '../../../data/cubits/subscription/get_subsctiption_package_limits_cubit.dart';
import '../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../data/model/subscription_pacakage_model.dart';
import '../../../data/model/subscription_package_limit.dart';
import '../../../data/model/system_settings_model.dart';
import '../../../settings.dart';
import '../../../utils/AdMob/bannerAdLoadWidget.dart';
import '../../../utils/AdMob/interstitialAdManager.dart';
import '../../../utils/AppIcon.dart';
import '../../../utils/Extensions/extensions.dart';
import '../../../utils/LiquidIndicator/src/liquid_circular_progress_indicator.dart';
import '../../../utils/constant.dart';
import '../../../utils/responsiveSize.dart';
import '../../../utils/ui_utils.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';
import '../widgets/Erros/no_data_found.dart';
import '../widgets/Erros/no_internet.dart';
import '../widgets/Erros/something_went_wrong.dart';
import '../widgets/blurred_dialoge_box.dart';
import '../widgets/shimmerLoadingContainer.dart';
import 'payment_gatways.dart';

class SubscriptionPackageListScreen extends StatefulWidget {
  const SubscriptionPackageListScreen({super.key});
  static Route route(RouteSettings settings) {
    return BlurredRouter(
      builder: (context) {
        return MultiBlocProvider(providers: [
          BlocProvider(
            create: (context) => GetSubsctiptionPackageLimitsCubit(),
          ),
          BlocProvider(
            create: (context) => AssignFreePackageCubit(),
          ),
        ], child: const SubscriptionPackageListScreen());

        // return BlocProvider(
        //   create: (context) => GetSubsctiptionPackageLimitsCubit(),
        //   child: const SubscriptionPackageListScreen(),
        // );
      },
    );
  }

  @override
  State<SubscriptionPackageListScreen> createState() =>
      _SubscriptionPackageListScreenState();
}

class _SubscriptionPackageListScreenState
    extends State<SubscriptionPackageListScreen> {
  List mySubscriptions = [];
  bool isLifeTimeSubscription = false;
  bool hasAlreadyPackage = false;
  InterstitialAdManager interstitialAdManager = InterstitialAdManager();
  @override
  void initState() {
    context.read<FetchSubscriptionPackagesCubit>().fetchPackages();
    interstitialAdManager.load();
    PaymentGatways.initPaystack();
    mySubscriptions = context
            .read<FetchSystemSettingsCubit>()
            .getSetting(SystemSetting.subscription) ??
        [];
    if (mySubscriptions.isNotEmpty) {
      isLifeTimeSubscription = mySubscriptions[0]['end_date'] == null;
      context
          .read<GetSubsctiptionPackageLimitsCubit>()
          .getLimits(Constant.subscriptionPackageId.toString());
    }

    hasAlreadyPackage = mySubscriptions.isNotEmpty;
    super.initState();
  }

  dynamic ifServiceUnlimited(dynamic text, {dynamic remining}) {
    if (text == "unlimited") {
      return UiUtils.getTranslatedLabel(context, "unlimited");
    }
    if (text == "not_available") {
      return "";
    }
    if (remining != null) {
      return "";
    }

    return text;
  }

  bool isUnlimited(int text, {dynamic remining}) {
    if (text == 0) {
      return true;
    }
    if (remining != null) {
      return false;
    }

    return false;
  }

  int selectedPage = 0;

  @override
  Widget build(BuildContext context) {
    dynamic advertismentRemining = "--";
    dynamic propertyRemining = "--";

    if (context.watch<GetSubsctiptionPackageLimitsCubit>().state
        is GetSubsctiptionPackageLimitsSuccess) {
      SubcriptionPackageLimit packageLimit = (context
              .watch<GetSubsctiptionPackageLimitsCubit>()
              .state as GetSubsctiptionPackageLimitsSuccess)
          .packageLimit;

      advertismentRemining = (packageLimit.usedLimitOfAdvertisement).toString();
      propertyRemining = (packageLimit.usedLimitOfProperty).toString();
    }
    return RefreshIndicator(
      backgroundColor: context.color.primaryColor,
      color: context.color.tertiaryColor,
      onRefresh: () async {
        context.read<FetchSubscriptionPackagesCubit>().fetchPackages();

        mySubscriptions = context
            .read<FetchSystemSettingsCubit>()
            .getSetting(SystemSetting.subscription);

        if (mySubscriptions.isNotEmpty) {
          isLifeTimeSubscription = mySubscriptions[0]['end_date'] == null;
        }

        hasAlreadyPackage = mySubscriptions.isNotEmpty;
      },
      child: Scaffold(
        backgroundColor: context.color.primaryColor,
        appBar: UiUtils.buildAppBar(
          context,
          showBackButton: true,
          title: UiUtils.getTranslatedLabel(context, "subsctiptionPlane"),
        ),
        bottomNavigationBar: const BottomAppBar(
          child: BannerAdWidget(bannerSize: AdSize.banner),
        ),
        body: WillPopScope(
          onWillPop: () async {
            await interstitialAdManager.show();
            return true;
          },
          child:
              BlocListener<FetchSystemSettingsCubit, FetchSystemSettingsState>(
            listener: (context, state) {
              if (state is FetchSystemSettingsSuccess) {
                mySubscriptions = state.settings['data']['package']
                    ['user_purchased_package'] as List;
                setState(() {});
              }
            },
            child: Builder(builder: (context) {
              return BlocListener<AssignFreePackageCubit,
                  AssignFreePackageState>(
                listener: (context, state) {
                  if (state is AssignFreePackageInProgress) {
                    Widgets.showLoader(context);
                  }

                  if (state is AssignFreePackageSuccess) {
                    Widgets.hideLoder(context);
                    context
                        .read<FetchSystemSettingsCubit>()
                        .fetchSettings(isAnonymouse: false, forceRefresh: true);
                    HelperUtils.showSnackBarMessage(
                        context, "Free package is assigned");
                  }

                  if (state is AssignFreePackageFail) {
                    Widgets.hideLoder(context);

                    HelperUtils.showSnackBarMessage(
                        context, "Failed to assign free package");
                  }
                },
                child: BlocConsumer<FetchSubscriptionPackagesCubit,
                    FetchSubscriptionPackagesState>(
                  listener: (context, FetchSubscriptionPackagesState state) {},
                  builder: (context, state) {
                    if (state is FetchSubscriptionPackagesInProgress) {
                      return ListView.builder(
                        itemCount: 10,
                        shrinkWrap: true,
                        padding: const EdgeInsets.all(16),
                        itemBuilder: (context, index) {
                          return const Padding(
                            padding: EdgeInsets.symmetric(
                              vertical: 8.0,
                            ),
                            child: CustomShimmer(
                              height: 160,
                            ),
                          );
                        },
                      );
                    }
                    if (state is FetchSubscriptionPackagesFailure) {
                      if (state.errorMessage is ApiException) {
                        if (state.errorMessage.errorMessage == "no-internet") {
                          return NoInternet(
                            onRetry: () {
                              context
                                  .read<FetchSubscriptionPackagesCubit>()
                                  .fetchPackages();
                            },
                          );
                        }
                      }

                      return const SomethingWentWrong();
                    }
                    if (state is FetchSubscriptionPackagesSuccess) {
                      if (state.subscriptionPacakges.isEmpty &&
                          mySubscriptions.isEmpty) {
                        return NoDataFound(
                          onTap: () {
                            context
                                .read<FetchSubscriptionPackagesCubit>()
                                .fetchPackages();

                            mySubscriptions = context
                                .read<FetchSystemSettingsCubit>()
                                .getSetting(SystemSetting.subscription);

                            if (mySubscriptions.isNotEmpty) {
                              isLifeTimeSubscription =
                                  mySubscriptions[0]['end_date'] == null;
                            }

                            hasAlreadyPackage = mySubscriptions.isNotEmpty;
                            setState(() {});
                          },
                        );
                      }

                      // return Column(
                      //   mainAxisAlignment: MainAxisAlignment.center,
                      //   children: [
                      //     CarouselSlider.builder(
                      //       itemCount: state.subscriptionPacakges.length,
                      //       itemBuilder: (BuildContext context, int itemIndex,
                      //           int pageViewIndex) {
                      //         SubscriptionPackageModel subscriptionPacakge =
                      //             state.subscriptionPacakges[itemIndex];
                      //         return Container(
                      //           width: context.screenWidth * 0.98,
                      //           decoration: BoxDecoration(
                      //               color: context.color.secondaryColor,
                      //               borderRadius: BorderRadius.circular(18),
                      //               border: Border.all(
                      //                   color: context.color.borderColor,
                      //                   width: 1.5)),
                      //           child: Column(
                      //             children: [
                      //               const SizedBox(
                      //                 height: 24,
                      //               ),
                      //               Text(subscriptionPacakge.name.toString())
                      //                   .size(context.font.extraLarge)
                      //                   .color(context.color.teritoryColor)
                      //                   .bold(weight: FontWeight.w600),
                      //               const SizedBox(
                      //                 height: 14,
                      //               ),
                      //               Container(
                      //                 width: 186,
                      //                 height: 186,
                      //                 decoration: BoxDecoration(
                      //                   color: context.color.teritoryColor
                      //                       .withOpacity(0.1),
                      //                   shape: BoxShape.circle,
                      //                 ),
                      //                 child: SvgPicture.asset(AppIcons.placeHolder),
                      //               ),
                      //               const SizedBox(
                      //                 height: 10,
                      //               ),
                      //               Padding(
                      //                 padding: const EdgeInsets.fromLTRB(
                      //                     20.0, 10, 20, 10),
                      //                 child: Container(
                      //                   height: 75,
                      //                   decoration: BoxDecoration(
                      //                       borderRadius: BorderRadius.circular(14),
                      //                       border: Border.all(
                      //                           color: context.color.teritoryColor,
                      //                           width: 1.5)),
                      //                   child: Padding(
                      //                     padding: const EdgeInsets.symmetric(
                      //                         horizontal: 18.0, vertical: 14),
                      //                     child: Row(
                      //                       mainAxisAlignment:
                      //                           MainAxisAlignment.spaceBetween,
                      //                       crossAxisAlignment:
                      //                           CrossAxisAlignment.center,
                      //                       children: [
                      //                         Column(
                      //                           crossAxisAlignment:
                      //                               CrossAxisAlignment.start,
                      //                           children: [
                      //                             Text("30 Days")
                      //                                 .size(context.font.larger)
                      //                                 .bold(
                      //                                     weight: FontWeight.w600),
                      //                             Text("50% Off").color(
                      //                                 context.color.textLightColor)
                      //                           ],
                      //                         ),
                      //                         Column(
                      //                           crossAxisAlignment:
                      //                               CrossAxisAlignment.end,
                      //                           children: [
                      //                             Text(r"$549")
                      //                                 .size(context.font.larger)
                      //                                 .bold(
                      //                                     weight: FontWeight.w600),
                      //                             Text(r"800").color(
                      //                                 context.color.textLightColor)
                      //                           ],
                      //                         )
                      //                       ],
                      //                     ),
                      //                   ),
                      //                 ),
                      //               ),
                      //               Padding(
                      //                 padding: const EdgeInsets.all(19.0),
                      //                 child: Column(
                      //                   children: [
                      //                     PlanFacilityRow(
                      //                         count: subscriptionPacakge
                      //                             .advertisementlimit
                      //                             .toString(),
                      //                         facilityTitle:
                      //                             "Advertisement limit is",
                      //                         icon: AppIcons.ads),
                      //                     const SizedBox(
                      //                       height: 12,
                      //                     ),
                      //                     PlanFacilityRow(
                      //                         count: subscriptionPacakge
                      //                             .propertyLimit
                      //                             .toString(),
                      //                         facilityTitle: "Property limit is",
                      //                         icon: AppIcons.propertyLimites),
                      //                     const SizedBox(
                      //                       height: 12,
                      //                     ),
                      //                     PlanFacilityRow(
                      //                         count:
                      //                             "${subscriptionPacakge.duration}",
                      //                         facilityTitle: "Validity ",
                      //                         icon: AppIcons.days),
                      //                   ],
                      //                 ),
                      //               ),
                      //             ],
                      //           ),
                      //         );
                      //       },
                      //       options: CarouselOptions(
                      //           autoPlay: false,
                      //           enlargeCenterPage: true,
                      //           onPageChanged: (index, reason) {
                      //             selectedPage = index;
                      //             setState(() {});
                      //           },
                      //           viewportFraction: 0.8,
                      //           initialPage: 0,
                      //           height: 420 + 72 + 15,
                      //           // clipBehavior: Clip.antiAlias,
                      //           disableCenter: true,
                      //           enableInfiniteScroll: false),
                      //     ),
                      //     const SizedBox(
                      //       height: 38,
                      //     ),
                      //     Indicator(state, context),
                      //     const SizedBox(
                      //       height: 38,
                      //     ),
                      //     MaterialButton(
                      //       onPressed: () {},
                      //       height: 50,
                      //       minWidth: context.screenWidth * 0.8,
                      //       shape: RoundedRectangleBorder(
                      //         borderRadius: BorderRadius.circular(12),
                      //       ),
                      //       color: context.color.teritoryColor,
                      //       child: const Text("Subscribe Now")
                      //           .color(context.color.buttonColor)
                      //           .size(context.font.larger),
                      //     ),
                      //   ],
                      // );

                      return SingleChildScrollView(
                        physics: const BouncingScrollPhysics(),
                        child: Column(
                          children: [
                            ...mySubscriptions.map((subscription) {
                              var packageName = subscription['package']['name'];
                              var packagePrice =
                                  subscription['package']['price'].toString();
                              var packageValidity =
                                  subscription['package']['duration'];
                              var advertismentLimit = subscription['package']
                                  ['advertisement_limit'];
                              var propertyLimit =
                                  subscription['package']['property_limit'];
                              var startDate = subscription['start_date']
                                  .toString()
                                  .formatDate(format: "d MMM yyyy");
                              var startDay = subscription['start_date']
                                  .toString()
                                  .formatDate(format: "EEEE");

                              var endDate = subscription['end_date'];
                              return Padding(
                                padding:
                                    const EdgeInsets.fromLTRB(16, 10, 16, 16),
                                child: CurrentPackageTileCard(
                                  startDay: startDay,
                                  name: packageName,
                                  price: packagePrice,
                                  advertismentLimit: advertismentLimit,
                                  propertyLimit: propertyLimit,
                                  duration: packageValidity,
                                  endDate: endDate,
                                  startDate: startDate,
                                  advertismentRemining: advertismentRemining,
                                  propertyRemining: propertyRemining,
                                ),
                              );
                            }).toList(),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: state.subscriptionPacakges.length,
                              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                              itemBuilder: (context, index) {
                                SubscriptionPackageModel subscriptionPacakge =
                                    state.subscriptionPacakges[index];
                                return Padding(
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 8.0),
                                  child: buildPackageTile(
                                    context,
                                    subscriptionPacakge,
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      );
                    }

                    return Container();
                  },
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  Row Indicator(FetchSubscriptionPackagesSuccess state, BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ...List.generate((state.subscriptionPacakges.length), (index) {
          bool isSelected = selectedPage == index;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3),
            child: Container(
              width: isSelected ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                border: isSelected
                    ? Border()
                    : Border.all(color: context.color.textColorDark),
                color: isSelected
                    ? context.color.tertiaryColor
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        })
      ],
    );
  }

  Widget PlanFacilityRow(
      {required String icon,
      required String facilityTitle,
      required String count}) {
    return Row(
      children: [
        SvgPicture.asset(
          icon,
          width: 24,
          height: 24,
          color: context.color.tertiaryColor,
        ),
        const SizedBox(
          width: 11,
        ),
        Text(facilityTitle + " " + count)
            .size(context.font.large)
            .color(context.color.textColorDark.withOpacity(0.8))
      ],
    );
  }

  Widget currentPackageTile(
      {required String name,
      dynamic advertismentLimit,
      dynamic propertyLimit,
      dynamic duration,
      dynamic startDate,
      dynamic endDate,
      dynamic advertismentRemining,
      dynamic propertyRemining,
      required String price}) {
    if (endDate != null) {
      endDate = endDate.toString().formatDate();
    }

    return Container(
      decoration: BoxDecoration(
        color: context.color.secondaryColor,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                SizedBox(
                  width: context.screenWidth,
                  child: UiUtils.getSvg(
                    AppIcons.headerCurve,
                    color: context.color.tertiaryColor,
                    fit: BoxFit.fitWidth,
                  ),
                ),
                PositionedDirectional(
                  start: 10.rw(context),
                  top: 8.rh(context),
                  child: Text(
                          UiUtils.getTranslatedLabel(context, "currentPackage"))
                      .size(context.font.larger)
                      .color(context.color.secondaryColor)
                      .bold(weight: FontWeight.w600),
                )
              ],
            ),
            const SizedBox(
              height: 5,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(name)
                  .size(context.font.larger)
                  .color(context.color.textColorDark)
                  .bold(weight: FontWeight.w600),
            ),
            const SizedBox(
              height: 20,
            ),
            if (advertismentLimit != "not_available")
              Row(
                children: [
                  bulletPoint(context,
                      "${UiUtils.getTranslatedLabel(context, "adLimitIs")} ${advertismentLimit == '' ? UiUtils.getTranslatedLabel(context, "lifetime") : ifServiceUnlimited(advertismentLimit, remining: advertismentRemining)}"),
                  const Spacer(),
                  if (!isUnlimited(advertismentLimit,
                          remining: advertismentRemining) &&
                      advertismentLimit != "")
                    SizedBox(
                      height: 60,
                      width: 60,
                      child: LiquidCircularProgressIndicator(
                        value: double.parse(advertismentRemining) /
                            advertismentLimit, // Defaults to 0.5.
                        valueColor: AlwaysStoppedAnimation(
                          context.color.tertiaryColor.withOpacity(0.3),
                        ), // Defaults to the current Theme's accentColor.
                        backgroundColor: Colors
                            .white, // Defaults to the current Theme's backgroundColor.
                        borderColor: context.color.tertiaryColor,
                        borderWidth: 3.0,
                        direction: Axis.vertical,

                        // The direction the liquid moves (Axis.vertical = bottom to top, Axis.horizontal = left to right). Defaults to Axis.vertical.
                        center:
                            Text("$advertismentRemining/$advertismentLimit"),
                      ),
                    ),
                ],
              ),
            SizedBox(
              height: 5.rh(context),
            ),
            Row(
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  if (propertyLimit != null)
                    bulletPoint(context,
                        "${UiUtils.getTranslatedLabel(context, "propertyLimit")} ${propertyLimit == '' ? UiUtils.getTranslatedLabel(context, "lifetime") : ifServiceUnlimited(propertyLimit, remining: propertyRemining)}"),
                  SizedBox(
                    height: 5.rh(context),
                  ),
                  if (isLifeTimeSubscription)
                    Row(
                      children: [
                        bulletPoint(context,
                            "${UiUtils.getTranslatedLabel(context, "validity")} ${endDate ?? UiUtils.getTranslatedLabel(context, "lifetime")} "),
                      ],
                    ),
                  if (!isLifeTimeSubscription)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 4,
                            height: 4,
                            decoration: BoxDecoration(
                              color: context.color.textColorDark,
                              shape: BoxShape.circle,
                            ),
                          ),
                          SizedBox(
                            width: 5.rw(context),
                          ),
                          SizedBox(
                            width: context.screenWidth * 0.5,
                            child: Text(UiUtils.getTranslatedLabel(
                                    context, "packageStartedOn") +
                                startDate +
                                UiUtils.getTranslatedLabel(
                                    context, "andPackageWillEndOn") +
                                endDate.toString()),
                          ),
                        ],
                      ),
                    )
                ]),
                const Spacer(),
                if (!isUnlimited(propertyLimit, remining: propertyRemining) &&
                    propertyLimit != "")
                  SizedBox(
                    height: 60,
                    width: 60,
                    child: LiquidCircularProgressIndicator(
                      value: double.parse(advertismentRemining) /
                          advertismentLimit, // Defaults to 0.5.
                      valueColor: AlwaysStoppedAnimation(
                        context.color.tertiaryColor.withOpacity(0.3),
                      ), // Defaults to the current Theme's accentColor.
                      backgroundColor: Colors
                          .white, // Defaults to the current Theme's backgroundColor.
                      borderColor: context.color.tertiaryColor,
                      borderWidth: 3.0,
                      direction: Axis.vertical,

                      // The direction the liquid moves (Axis.vertical = bottom to top, Axis.horizontal = left to right). Defaults to Axis.vertical.
                      center: Text("$advertismentRemining/$advertismentLimit"),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget buildPackageTile(
    BuildContext context,
    SubscriptionPackageModel subscriptionPacakge,
  ) {
    return Container(
      decoration: BoxDecoration(
          color: context.color.tertiaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(18)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            children: [
              SizedBox(
                width: context.screenWidth,
                child: UiUtils.getSvg(AppIcons.headerCurve,
                    color: context.color.tertiaryColor, fit: BoxFit.fitWidth),
              ),
              PositionedDirectional(
                start: 10.rw(context),
                top: 8.rh(context),
                child: Text(subscriptionPacakge.name ?? "")
                    .size(context.font.larger)
                    .color(context.color.secondaryColor)
                    .bold(weight: FontWeight.w600),
              )
            ],
          ),
          const SizedBox(
            height: 20,
          ),
          if (subscriptionPacakge.advertisementlimit != "not_available")
            bulletPoint(context,
                "${UiUtils.getTranslatedLabel(context, "adLimitIs")} ${subscriptionPacakge.advertisementlimit == '' ? UiUtils.getTranslatedLabel(context, "lifetime") : ifServiceUnlimited(subscriptionPacakge.advertisementlimit)}"),
          SizedBox(
            height: 5.rh(context),
          ),
          Row(
            children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                if (subscriptionPacakge.propertyLimit != "not_available")
                  bulletPoint(context,
                      "${UiUtils.getTranslatedLabel(context, "propertyLimit")} ${subscriptionPacakge.propertyLimit == '' ? UiUtils.getTranslatedLabel(context, "lifetime") : ifServiceUnlimited(subscriptionPacakge.propertyLimit)}"),
                SizedBox(
                  height: 5.rh(context),
                ),
                bulletPoint(context,
                    "${UiUtils.getTranslatedLabel(context, "validity")} ${subscriptionPacakge.duration == 0 ? UiUtils.getTranslatedLabel(context, "lifetime") : subscriptionPacakge.duration} ${subscriptionPacakge.duration == 0 ? "" : UiUtils.getTranslatedLabel(context, "days")}"),
              ]),
              // const Spacer(),
              Expanded(
                child: Padding(
                  padding: const EdgeInsetsDirectional.only(end: 15.0),
                  child: Container(
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                          color: context.color.secondaryColor,
                          borderRadius: BorderRadius.circular(8)),
                      height: 39.rh(context),
                      constraints: BoxConstraints(
                        minWidth: 80.rw(context),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4.0),
                        child: Text(
                          ("${subscriptionPacakge.price}")
                              .toString()
                              .formatAmount(prefix: true),
                          style: const TextStyle(fontFamily: "ROBOTO"),
                        )
                            .color(context.color.tertiaryColor)
                            .bold()
                            .size(context.font.large),
                      )),
                ),
              )
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: UiUtils.buildButton(context, onPressed: () async {
              if (mySubscriptions.isEmpty) {
                if (subscriptionPacakge.price?.toInt() == 0) {
                  context
                      .read<AssignFreePackageCubit>()
                      .assign(subscriptionPacakge.id!);
                  return;
                }

                PaymentService paymentService = PaymentService();
                paymentService.targetGatwayKey =
                    AppSettings.enabledPaymentGatway;
                paymentService.attachedGatways(gatways);
                paymentService.setContext(context);
                paymentService.setPackage(subscriptionPacakge);
                paymentService.pay();
              } else {
                var proceed = await UiUtils.showBlurredDialoge(
                  context,
                  sigmaX: 3,
                  sigmaY: 3,
                  dialoge: BlurredDialogBox(
                    title: UiUtils.getTranslatedLabel(context, "warning"),
                    cancelTextColor: context.color.textColorDark,
                    acceptButtonName:
                        UiUtils.getTranslatedLabel(context, "proceed"),
                    content: Text(
                      UiUtils.getTranslatedLabel(
                          context, "currentPacakgeActiveWarning"),
                    ),
                  ),
                );

                if (proceed == true) {
                  Future.delayed(
                    Duration.zero,
                    () {
                      if (subscriptionPacakge.price?.toInt() == 0) {
                        context
                            .read<AssignFreePackageCubit>()
                            .assign(subscriptionPacakge.id!);

                        return;
                      }
                      PaymentService paymentService = PaymentService();
                      paymentService.targetGatwayKey =
                          AppSettings.enabledPaymentGatway;
                      paymentService.attachedGatways(gatways);
                      paymentService.setContext(context);
                      paymentService.setPackage(subscriptionPacakge);
                      paymentService.pay();
                      // PaymentGatways.openEnabled(context,
                      //     subscriptionPacakge.price, subscriptionPacakge);
                    },
                  );
                }
              }
            },
                radius: 9,
                height: 33.rh(context),
                buttonTitle: UiUtils.getTranslatedLabel(context, "subscribe")),
          ),
        ],
      ),
    );
  }

  Widget bulletPoint(BuildContext context, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 20,
      ),
      child: SizedBox(
        width: context.screenWidth * 0.55,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 4,
              height: 4,
              decoration: BoxDecoration(
                color: context.color.textColorDark,
                shape: BoxShape.circle,
              ),
            ),
            SizedBox(
              width: 5.rw(context),
            ),
            Expanded(
              child: Text(text).setMaxLines(
                lines: 2,
              ),
            )
          ],
        ),
      ),
    );
  }
}
