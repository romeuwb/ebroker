import 'dart:developer';

import 'package:ebroker/Ui/screens/widgets/Erros/no_internet.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../../app/routes.dart';
import '../../../data/cubits/property/fetch_property_from_category_cubit.dart';
import '../../../data/model/property_model.dart';
import '../../../utils/AdMob/bannerAdLoadWidget.dart';
import '../../../utils/AdMob/interstitialAdManager.dart';
import '../../../utils/Extensions/extensions.dart';
import '../../../utils/api.dart';
import '../../../utils/constant.dart';
import '../../../utils/responsiveSize.dart';
import '../../../utils/ui_utils.dart';
import '../home/Widgets/property_horizontal_card.dart';
import '../main_activity.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';
import '../widgets/Erros/no_data_found.dart';
import '../widgets/shimmerLoadingContainer.dart';

class PropertiesList extends StatefulWidget {
  final String? categoryId, categoryName;

  const PropertiesList({Key? key, this.categoryId, this.categoryName})
      : super(key: key);

  @override
  PropertiesListState createState() => PropertiesListState();
  static Route route(RouteSettings routeSettings) {
    Map? arguments = routeSettings.arguments as Map?;
    return BlurredRouter(
      builder: (_) => PropertiesList(
        categoryId: arguments?['catID'] as String,
        categoryName: arguments?['catName'] ?? "",
      ),
    );
  }
}

class PropertiesListState extends State<PropertiesList> {
  int offset = 0, total = 0;

  late ScrollController controller;
  List<PropertyModel> propertylist = [];
  int adPosition = 9;
  InterstitialAdManager interstitialAdManager = InterstitialAdManager();
  @override
  void initState() {
    super.initState();
    searchbody = {};
    loadAd();
    interstitialAdManager.load();
    Constant.propertyFilter = null;
    controller = ScrollController()..addListener(_loadMore);
    context.read<FetchPropertyFromCategoryCubit>().fetchPropertyFromCategory(
        int.parse(
          widget.categoryId!,
        ),
        showPropertyType: false);

    Future.delayed(Duration.zero, () {
      selectedcategoryId = widget.categoryId!;
      selectedcategoryName = widget.categoryName!;
      searchbody[Api.categoryId] = widget.categoryId;
      setState(() {});
    });
  }

  BannerAd? _bannerAd;
  bool _isLoaded = false;
  void loadAd() {
    _bannerAd = BannerAd(
      adUnitId: Constant.admobBannerAndroid,
      request: const AdRequest(),
      size: AdSize.largeBanner,
      listener: BannerAdListener(
        // Called when an ad is successfully received.
        onAdLoaded: (ad) {
          debugPrint('$ad loaded.');
          setState(() {
            _isLoaded = true;
          });
        },
        // Called when an ad request failed.
        onAdFailedToLoad: (ad, err) {
          // Dispose the ad here to free resources.
          ad.dispose();
        },
      ),
    )..load();
  }

  @override
  void dispose() {
    controller.removeListener(_loadMore);
    controller.dispose();
    super.dispose();
  }

  void _loadMore() async {
    if (controller.isEndReached()) {
      if (context.read<FetchPropertyFromCategoryCubit>().hasMoreData()) {
        context
            .read<FetchPropertyFromCategoryCubit>()
            .fetchPropertyFromCategoryMore();
      }
    }
  }

  Widget? noInternetCheck(error) {
    if (error is ApiException) {
      if ((error).errorMessage == 'no-internet') {
        return NoInternet(
          onRetry: () {
            context
                .read<FetchPropertyFromCategoryCubit>()
                .fetchPropertyFromCategory(
                    int.parse(
                      widget.categoryId!,
                    ),
                    showPropertyType: false);
          },
        );
      }
    }
    return null;
  }

  int itemIndex = 0;
  @override
  Widget build(BuildContext context) {
    return bodyWidget();
  }

  Widget bodyWidget() {
    return WillPopScope(
      onWillPop: () async {
        await interstitialAdManager.show();
        Constant.propertyFilter = null;
        return true;
      },
      child: Scaffold(
          backgroundColor: Theme.of(context).colorScheme.primaryColor,
          appBar: UiUtils.buildAppBar(context,
              showBackButton: true,
              title: selectedcategoryName == ""
                  ? widget.categoryName
                  : selectedcategoryName,
              actions: [
                filterOptionsBtn(),
              ]),
          bottomNavigationBar: const BottomAppBar(
            child: BannerAdWidget(bannerSize: AdSize.banner),
          ),
          body: BlocBuilder<FetchPropertyFromCategoryCubit,
              FetchPropertyFromCategoryState>(builder: (context, state) {
            if (state is FetchPropertyFromCategoryInProgress) {
              return ListView.builder(
                padding:
                    const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
                itemCount: 10,
                itemBuilder: (context, index) {
                  return buildPropertiesShimmer(context);
                },
              );
            }

            if (state is FetchPropertyFromCategoryFailure) {
              var error = noInternetCheck(state.errorMessage);
              if (error != null) {
                return error;
              }
              return Center(
                child: Text(state.errorMessage),
              );
            }
            if (state is FetchPropertyFromCategorySuccess) {
              if (state.propertymodel.isEmpty) {
                return Center(
                  child: NoDataFound(
                    onTap: () {
                      context
                          .read<FetchPropertyFromCategoryCubit>()
                          .fetchPropertyFromCategory(
                              int.parse(
                                widget.categoryId!,
                              ),
                              showPropertyType: false);
                    },
                  ),
                );
              }

              return Column(
                children: [
                  Expanded(
                    child: ListView.separated(
                      shrinkWrap: true,
                      controller: controller,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 15, vertical: 3),
                      itemCount: state.propertymodel.length,
                      physics: const BouncingScrollPhysics(),
                      separatorBuilder: (context, index) {
                        if ((index + 1) % adPosition == 0) {
                          return (_bannerAd == null)
                              ? Container()
                              : Builder(builder: (context) {
                                  return BannerAdWidget();
                                });
                        }

                        return const SizedBox.shrink();
                      },
                      itemBuilder: (context, index) {
                        PropertyModel property = state.propertymodel[index];
                        return GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(
                              context,
                              Routes.propertyDetails,
                              arguments: {
                                'propertyData': property,
                                'propertiesList': state.propertymodel,
                                'fromMyProperty': false,
                              },
                            );
                          },
                          child: PropertyHorizontalCard(
                            property: property,
                          ),
                        );
                      },
                    ),
                  ),
                  if (state.isLoadingMore) UiUtils.progress()
                ],
              );
            }
            return Container();
          })),
    );
  }

  Widget buildPropertiesShimmer(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        height: 120.rh(context),
        decoration: BoxDecoration(
            border: Border.all(width: 1.5, color: context.color.borderColor),
            color: context.color.secondaryColor,
            borderRadius: BorderRadius.circular(18)),
        child: Row(
          children: [
            CustomShimmer(
              height: 120.rh(context),
              width: 100.rw(context),
            ),
            SizedBox(
              width: 10.rw(context),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                CustomShimmer(
                  width: 100.rw(context),
                  height: 10,
                  borderRadius: 7,
                ),
                CustomShimmer(
                  width: 150.rw(context),
                  height: 10,
                  borderRadius: 7,
                ),
                CustomShimmer(
                  width: 120.rw(context),
                  height: 10,
                  borderRadius: 7,
                ),
                CustomShimmer(
                  width: 80.rw(context),
                  height: 10,
                  borderRadius: 7,
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget filterOptionsBtn() {
    return IconButton(
        onPressed: () {
          // show filter screen

          // Constant.propertyFilter = null;
          Navigator.pushNamed(context, Routes.filterScreen,
              arguments: {"showPropertyType": false}).then((value) {
            if (value == true) {
              context
                  .read<FetchPropertyFromCategoryCubit>()
                  .fetchPropertyFromCategory(int.parse(widget.categoryId!),
                      showPropertyType: false);
            }
            setState(() {});
          });
        },
        icon: Icon(
          Icons.filter_list_rounded,
          color: context.color.textColorDark,
        ));
  }
}
