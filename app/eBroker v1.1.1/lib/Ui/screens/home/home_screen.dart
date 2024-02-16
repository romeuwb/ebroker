// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:cached_network_image/cached_network_image.dart';
import 'package:ebroker/Ui/screens/home/Widgets/category_card.dart';
import 'package:ebroker/Ui/screens/home/Widgets/property_gradient_card.dart';
import 'package:ebroker/Ui/screens/home/Widgets/property_horizontal_card.dart';
import 'package:ebroker/Ui/screens/proprties/viewAll.dart';
import 'package:ebroker/app/default_app_setting.dart';
import 'package:ebroker/data/cubits/Personalized/fetch_personalized_properties.dart';
import 'package:ebroker/data/cubits/Utility/proeprty_edit_global.dart';
import 'package:ebroker/data/cubits/category/fetch_cities_category.dart';
import 'package:ebroker/data/cubits/property/fetch_city_property_list.dart';
import 'package:ebroker/data/cubits/property/fetch_nearby_property_cubit.dart';
import 'package:ebroker/data/cubits/property/fetch_recent_properties.dart';
import 'package:ebroker/utils/AdMob/bannerAdLoadWidget.dart';
import 'package:ebroker/utils/guestChecker.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:uni_links/uni_links.dart';

import '../../../app/app.dart';
import '../../../app/routes.dart';
import '../../../data/cubits/category/fetch_category_cubit.dart';
import '../../../data/cubits/favorite/add_to_favorite_cubit.dart';
import '../../../data/cubits/favorite/fetch_favorites_cubit.dart';
import '../../../data/cubits/property/fetch_home_properties_cubit.dart';
import '../../../data/cubits/property/fetch_most_liked_properties.dart';
import '../../../data/cubits/property/fetch_most_viewed_properties_cubit.dart';
import '../../../data/cubits/property/fetch_promoted_properties_cubit.dart';
import '../../../data/cubits/slider_cubit.dart';
import '../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../data/cubits/system/get_api_keys_cubit.dart';
import '../../../data/helper/design_configs.dart';
import '../../../data/model/category.dart';
import '../../../data/model/property_model.dart';
import '../../../data/model/system_settings_model.dart';
import '../../../settings.dart';
import '../../../utils/AppIcon.dart';
import '../../../utils/DeepLink/nativeDeepLinkManager.dart';
import '../../../utils/Extensions/extensions.dart';
import '../../../utils/api.dart';
import '../../../utils/constant.dart';
import '../../../utils/deeplinkManager.dart';
import '../../../utils/helper_utils.dart';
import '../../../utils/hive_utils.dart';
import '../../../utils/responsiveSize.dart';
import '../../../utils/sliver_grid_delegate_with_fixed_cross_axis_count_and_fixed_height.dart';
import '../../../utils/ui_utils.dart';
import '../main_activity.dart';
import '../widgets/Erros/no_data_found.dart';
import '../widgets/Erros/no_internet.dart';
import '../widgets/Erros/something_went_wrong.dart';
import '../widgets/shimmerLoadingContainer.dart';
import 'Widgets/city_heading_card.dart';
import 'Widgets/header_card.dart';
import 'Widgets/homeListener.dart';
import 'Widgets/home_profile_image_card.dart';
import 'Widgets/home_search.dart';
import 'Widgets/home_shimmers.dart';
import 'Widgets/location_widget.dart';
import 'Widgets/property_card_big.dart';
import 'slider_widget.dart';

const double sidePadding = 18;

class HomeScreen extends StatefulWidget {
  final String? from;
  const HomeScreen({Key? key, this.from}) : super(key: key);
  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen>
    with TickerProviderStateMixin, AutomaticKeepAliveClientMixin<HomeScreen> {
  @override
  bool get wantKeepAlive => true;
  List<PropertyModel> propertyLocalList = [];
  bool isCategoryEmpty = false;
  HomePageStateListener homeStateListener = HomePageStateListener();

  @override
  void initState() {
    DeepLinkManager.initDeepLinks(context);

    getInitialLink().then((value) {
      print("GOT THE LINK IN BACKGROUND $value");
      if (value == null) return;

      Navigator.push(
        Constant.navigatorKey.currentContext!,
        NativeLinkWidget.render(
          RouteSettings(name: value),
        ),
      );
    });
    linkStream.listen((event) {
      print("GOT THE LINK IN Forground $event");

      Navigator.push(
        Constant.navigatorKey.currentContext!,
        NativeLinkWidget.render(
          RouteSettings(name: event),
        ),
      );
    });

    initializeSettings();
    addPageScrollListener();
    notificationPermissionChecker();
    fetchApiKeys();
    loadInitialData(context);
    initializeHomeStateListener();

    super.initState();
  }

  void initializeSettings() {
    final settingsCubit = context.read<FetchSystemSettingsCubit>();
    if (!const bool.fromEnvironment("force-disable-demo-mode",
        defaultValue: false)) {
      Constant.isDemoModeOn =
          settingsCubit.getSetting(SystemSetting.demoMode) ?? false;
    }
  }

  void addPageScrollListener() {
    homeScreenController.addListener(pageScrollListener);
  }

  bool _isLoaded = false;

  void initializeHomeStateListener() {
    homeStateListener.init(
      setState,
      onNetAvailable: () {
        loadInitialData(context);
      },
    );
  }

  void fetchApiKeys() {
    context.read<GetApiKeysCubit>().fetch();
  }

  void pageScrollListener() {
    ///This will load data on page end
    if (homeScreenController.isEndReached()) {
      if (mounted) {
        if (context.read<FetchHomePropertiesCubit>().hasMoreData()) {
          context.read<FetchHomePropertiesCubit>().fetchMoreProperty();
        }
      }
    }
  }

  void _onTapPromotedSeeAll() {
    // Navigator.pushNamed(context, Routes.promotedPropertiesScreen);
    StateMap stateMap = StateMap<
        FetchPromotedPropertiesInitial,
        FetchPromotedPropertiesInProgress,
        FetchPromotedPropertiesSuccess,
        FetchPromotedPropertiesFailure>();

    ViewAllScreen<FetchPromotedPropertiesCubit, FetchPromotedPropertiesState>(
      title: "promotedProperties".translate(
        context,
      ),
      map: stateMap,
    ).open(context);
  }

  void _onTapNearByPropertiesAll() {
    StateMap stateMap = StateMap<
        FetchNearbyPropertiesInitial,
        FetchNearbyPropertiesInProgress,
        FetchNearbyPropertiesSuccess,
        FetchNearbyPropertiesFailure>();

    ViewAllScreen<FetchNearbyPropertiesCubit, FetchNearbyPropertiesState>(
      title: "nearByProperties".translate(context),
      map: stateMap,
    ).open(context);
  }

  void _onTapMostLikedAll() {
    ///Navigator.pushNamed(context, Routes.mostLikedPropertiesScreen);
    StateMap stateMap = StateMap<
        FetchMostLikedPropertiesInitial,
        FetchMostLikedPropertiesInProgress,
        FetchMostLikedPropertiesSuccess,
        FetchMostLikedPropertiesFailure>();

    ViewAllScreen<FetchMostLikedPropertiesCubit, FetchMostLikedPropertiesState>(
      title: "mostLikedProperties".translate(context),
      map: stateMap,
    ).open(context);
  }

  void _onTapMostViewedSeelAll() {
    StateMap stateMap = StateMap<
        FetchMostViewedPropertiesInitial,
        FetchMostViewedPropertiesInProgress,
        FetchMostViewedPropertiesSuccess,
        FetchMostViewedPropertiesFailure>();

    ViewAllScreen<FetchMostViewedPropertiesCubit,
        FetchMostViewedPropertiesState>(
      title: "mostViewed".translate(context),
      map: stateMap,
    ).open(context);
  }

  void _onRefresh() {
    context.read<FetchMostViewedPropertiesCubit>().fetch(forceRefresh: true);
    context.read<SliderCubit>().fetchSlider(context, forceRefresh: true);
    context.read<FetchCategoryCubit>().fetchCategories(forceRefresh: true);
    context.read<FetchRecentPropertiesCubit>().fetch(forceRefresh: true);
    context.read<FetchMostLikedPropertiesCubit>().fetch(forceRefresh: true);
    context.read<FetchNearbyPropertiesCubit>().fetch(forceRefresh: true);
    context.read<FetchPromotedPropertiesCubit>().fetch(forceRefresh: true);
    context
        .read<FetchCityCategoryCubit>()
        .fetchCityCategory(forceRefresh: true);
    context.read<FetchPersonalizedPropertyList>().fetch(forceRefresh: true);
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    HomeScreenDataBinding homeScreenState = homeStateListener.listen(context);

    // FirebaseMessaging.instance
    //     .getToken()
    //     .then((value) => log(value!, name: "FCM"));
    //
    // HiveUtils.getJWT()?.log("JWT");
    // HiveUtils.getUserId()?.log("USER ID");

    return SafeArea(
      child: RefreshIndicator(
        color: context.color.tertiaryColor,
        triggerMode: RefreshIndicatorTriggerMode.onEdge,
        onRefresh: () async {
          _onRefresh();
        },
        child: Scaffold(
          appBar: AppBar(
            elevation: 0,
            leadingWidth:
                HiveUtils.getCityName() != null ? 200.rw(context) : 130,
            leading: Padding(
              padding: EdgeInsetsDirectional.only(
                start: sidePadding.rw(context),
              ),
              child: HiveUtils.getCityName() != null
                  ? const LocationWidget()
                  : SizedBox(
                      child: LoadAppSettings().svg(appSettings.appHomeScreen!),
                    ),
            ),
            backgroundColor: const Color.fromARGB(0, 0, 0, 0),
            actions: [
              GuestChecker.updateUI(
                onChangeStatus: (bool? isGuest) {
                  Widget buildDefaultPersonSVG(BuildContext context) {
                    return Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                          color: context.color.tertiaryColor.withOpacity(0.1),
                          shape: BoxShape.circle),
                      child: Center(
                        child: UiUtils.getSvg(
                          AppIcons.defaultPersonLogo,
                          color: context.color.tertiaryColor,
                          // fit: BoxFit.none,
                          width: 30,
                          height: 30,
                        ),
                      ),
                    );
                  }

                  if (isGuest == null) {
                    return buildDefaultPersonSVG(context);
                  } else if (isGuest == true) {
                    return buildDefaultPersonSVG(context);
                  } else {
                    return const CircularProfileImageWidget();
                  }
                },
              )
            ],
          ),
          backgroundColor: context.color.primaryColor,
          body: Builder(builder: (context) {
            if (homeScreenState.state == HomeScreenDataState.fail) {
              return const SomethingWentWrong();
            }

            return BlocConsumer<FetchSystemSettingsCubit,
                FetchSystemSettingsState>(
              listener: (context, state) {
                if (state is FetchCategoryInProgress) {
                  homeStateListener.setNetworkState(setState, true);
                  setState(() {});
                }
                if (state is FetchSystemSettingsSuccess) {
                  homeStateListener.setNetworkState(setState, true);

                  setState(() {});
                  var setting = context
                      .read<FetchSystemSettingsCubit>()
                      .getSetting(SystemSetting.subscription);
                  if (setting.length != 0) {
                    String packageId = setting[0]['package_id'].toString();
                    Constant.subscriptionPackageId = packageId;
                  }
                }
              },
              builder: (context, state) {
                if (homeScreenState.state == HomeScreenDataState.success) {
                } else if (homeScreenState.state ==
                    HomeScreenDataState.nointernet) {
                  return NoInternet(
                    onRetry: () {
                      context.read<SliderCubit>().fetchSlider(context);
                      context.read<FetchCategoryCubit>().fetchCategories();
                      context.read<FetchMostViewedPropertiesCubit>().fetch();
                      context.read<FetchPromotedPropertiesCubit>().fetch();
                      context.read<FetchHomePropertiesCubit>().fetchProperty();
                    },
                  );
                }

                if (homeScreenState.state == HomeScreenDataState.nodata) {
                  return Center(
                    child: NoDataFound(
                      onTap: () {
                        context.read<SliderCubit>().fetchSlider(context);
                        context.read<FetchCategoryCubit>().fetchCategories();

                        context.read<FetchMostViewedPropertiesCubit>().fetch();
                        context.read<FetchPromotedPropertiesCubit>().fetch();
                        context
                            .read<FetchHomePropertiesCubit>()
                            .fetchProperty();
                      },
                    ),
                  );
                }

                return SingleChildScrollView(
                  controller: homeScreenController,
                  physics: const BouncingScrollPhysics(),
                  padding: EdgeInsets.symmetric(
                    vertical: MediaQuery.of(context).padding.top,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      ///Looping through sections so arrange it
                      ...List.generate(
                        AppSettings.sections.length,
                        (index) {
                          HomeScreenSections section =
                              AppSettings.sections[index];
                          if (section == HomeScreenSections.Search) {
                            return const HomeSearchField();
                          } else if (section == HomeScreenSections.Slider) {
                            return sliderWidget();
                          } else if (section == HomeScreenSections.Category) {
                            return categoryWidget();
                          } else if (section ==
                              HomeScreenSections.NearbyProperties) {
                            return buildNearByProperties();
                          } else if (section ==
                              HomeScreenSections.FeaturedProperties) {
                            return featuredProperties(homeScreenState, context);
                          } else if (section ==
                              HomeScreenSections.PersonalizedFeed) {
                            return const PersonalizedPropertyWidget();
                          } else if (section ==
                              HomeScreenSections.RecentlyAdded) {
                            return const RecentPropertiesSectionWidget();
                          } else if (section ==
                              HomeScreenSections.MostLikedProperties) {
                            return mostLikedProperties(
                                homeScreenState, context);
                          } else if (section == HomeScreenSections.MostViewed) {
                            return mostViewedProperties(
                                homeScreenState, context);
                          } else if (section ==
                              HomeScreenSections.PopularCities) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(
                                vertical: 10,
                              ),
                              child: Column(
                                children: [
                                  const BannerAdWidget(),
                                  const SizedBox(
                                    height: 10,
                                  ),
                                  popularCityProperties(),
                                ],
                              ),
                            );
                          } else {
                            return const SizedBox.shrink();
                          }
                        },
                      ),
                      const SizedBox(
                        height: 30,
                      ),
                    ],
                  ),
                );
              },
            );
          }),
        ),
      ),
    );
  }

  bool cityEmpty() {
    if (context.watch<FetchCityCategoryCubit>().state
        is FetchCityCategorySuccess) {
      return (context.watch<FetchCityCategoryCubit>().state
              as FetchCityCategorySuccess)
          .cities
          .isEmpty;
    }
    return true;
  }

  Widget popularCityProperties() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!cityEmpty()) const CityHeadingCard(),
        const SizedBox(
          height: 8,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: BlocBuilder<FetchCityCategoryCubit, FetchCityCategoryState>(
            builder: (context, FetchCityCategoryState state) {
              if (state is FetchCityCategorySuccess) {
                return StaggeredGrid.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 4,
                  crossAxisSpacing: 4,
                  children: [
                    ...List.generate(state.cities.length, (index) {
                      if ((index % 4 == 0 || index % 5 == 0)) {
                        return StaggeredGridTile.count(
                          crossAxisCellCount: 1,
                          mainAxisCellCount: 2,
                          child: buildCityCard(state, index),
                        );
                      } else {
                        return StaggeredGridTile.count(
                          crossAxisCellCount: 1,
                          mainAxisCellCount: 1,
                          child: buildCityCard(state, index),
                        );
                      }
                    }),
                  ],
                );
              }
              return Container();
            },
          ),
        ),
      ],
    );
  }

  Widget mostViewedProperties(
      HomeScreenDataBinding homeScreenState, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!homeScreenState.dataAvailability.isMostViewdPropertyEmpty)
          TitleHeader(
              onSeeAll: _onTapMostViewedSeelAll,
              title: UiUtils.getTranslatedLabel(context, "mostViewed")),
        if (!homeScreenState.dataAvailability.isMostViewdPropertyEmpty)
          buildMostViewedProperties(),
      ],
    );
  }

  Widget mostLikedProperties(
      HomeScreenDataBinding homeScreenState, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!homeScreenState.dataAvailability.isMostLikedPropertiesEmpty) ...[
          TitleHeader(
            onSeeAll: _onTapMostLikedAll,
            title: UiUtils.getTranslatedLabel(
              context,
              "mostLikedProperties",
            ),
          ),
          buildMostLikedProperties(),
          const SizedBox(
            height: 15,
          ),
        ],
      ],
    );
  }

  Widget featuredProperties(
      HomeScreenDataBinding homeScreenState, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!homeScreenState.dataAvailability.isPromotedPropertyEmpty)
          TitleHeader(
            onSeeAll: _onTapPromotedSeeAll,
            title: UiUtils.getTranslatedLabel(
              context,
              "promotedProperties",
            ),
          ),
        if (!homeScreenState.dataAvailability.isPromotedPropertyEmpty)
          buildPromotedProperites(),
      ],
    );
  }

  Widget sliderWidget() {
    return BlocConsumer<SliderCubit, SliderState>(
      listener: (context, state) {
        if (state is SliderFetchSuccess) {
          homeStateListener.setNetworkState(setState, true);
          setState(() {});
        }
      },
      builder: (context, state) {
        if (state is SliderFetchInProgress) {
          return const SliderShimmer();
        }
        if (state is SliderFetchFailure) {
          return Container();
        }
        if (state is SliderFetchSuccess) {
          if (state.sliderlist.isNotEmpty) {
            return const SliderWidget();
          }
        }
        return Container();
      },
    );
  }

  Widget buildCityCard(FetchCityCategorySuccess state, int index) {
    return GestureDetector(
      onTap: () {
        context.read<FetchCityPropertyList>().fetch(
              cityName: state.cities[index].name.toString(),
              forceRefresh: true,
            );

        var stateMap = StateMap<
            FetchCityPropertyInitial,
            FetchCityPropertyInProgress,
            FetchCityPropertySuccess,
            FetchCityPropertyFail>();

        ViewAllScreen<FetchCityPropertyList, FetchCityPropertyListState>(
          title: state.cities[index].name.firstUpperCase(),
          map: stateMap,
        ).open(context);
      },
      child: Container(
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(10)),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Stack(
            fit: StackFit.expand,
            children: [
              CachedNetworkImage(
                imageUrl: state.cities[index].image,
                filterQuality: FilterQuality.high,
                fit: BoxFit.cover,
              ),
              Container(
                width: double.infinity,
                height: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.black.withOpacity(0.76),
                      Colors.black.withOpacity(0.68),
                      Colors.black.withOpacity(0)
                    ],
                  ),
                ),
              ),
              PositionedDirectional(
                bottom: 8,
                start: 8,
                child: Text(
                        "${state.cities[index].name.toString().firstUpperCase()} (${state.cities[index].count})")
                    .color(context.color.buttonColor),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildPromotedProperites() {
    return BlocBuilder<FetchPromotedPropertiesCubit,
        FetchPromotedPropertiesState>(
      builder: (context, state) {
        if (state is FetchPromotedPropertiesInProgress) {
          return const PromotedPropertiesShimmer();
        }
        if (state is FetchPromotedPropertiesFailure) {
          return Text(state.error);
        }

        if (state is FetchPromotedPropertiesSuccess) {
          return SizedBox(
            height: 261,
            child: ListView.builder(
              itemCount: state.properties.length.clamp(0, 6),
              shrinkWrap: true,
              padding: const EdgeInsets.symmetric(
                horizontal: sidePadding,
              ),
              physics: const BouncingScrollPhysics(),
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, index) {
                GlobalKey thisITemkye = GlobalKey();

                ///Model
                PropertyModel propertymodel = state.properties[index];
                propertymodel =
                    context.watch<PropertyEditCubit>().get(propertymodel);
                return GestureDetector(
                    onTap: () {
                      FirebaseAnalytics.instance
                          .logEvent(name: "preview_property", parameters: {
                        "user_ids": HiveUtils.getUserId(),
                        "from_section": "featured",
                        "property_id": propertymodel.id,
                        "category_id": propertymodel.category!.id
                      });

                      HelperUtils.goToNextPage(
                        Routes.propertyDetails,
                        context,
                        false,
                        args: {
                          'propertyData': propertymodel,
                          'propertiesList': state.properties,
                          'fromMyProperty': false,
                        },
                      );
                    },
                    child: BlocProvider(
                      create: (context) {
                        return AddToFavoriteCubitCubit();
                      },
                      child: PropertyCardBig(
                        key: thisITemkye,
                        isFirst: index == 0,
                        property: propertymodel,
                        onLikeChange: (type) {
                          if (type == FavoriteType.add) {
                            context
                                .read<FetchFavoritesCubit>()
                                .add(propertymodel);
                          } else {
                            context
                                .read<FetchFavoritesCubit>()
                                .remove(state.properties[index].id);
                          }
                        },
                      ),
                    ));
              },
            ),
          );
        }

        return Container();
      },
    );
  }

  Widget buildMostLikedProperties() {
    return BlocConsumer<FetchMostLikedPropertiesCubit,
        FetchMostLikedPropertiesState>(
      listener: (context, state) {
        if (state is FetchMostLikedPropertiesFailure) {
          if (state.error is ApiException) {
            homeStateListener.setNetworkState(
                setState, !(state.error.errorMessage == "no-internet"));
          }
          setState(() {});
        }
        if (state is FetchMostLikedPropertiesSuccess) {
          homeStateListener.setNetworkState(setState, true);
          setState(() {});
        }
      },
      builder: (context, state) {
        if (state is FetchMostLikedPropertiesInProgress) {
          return const MostLikedPropertiesShimmer();
        }

        if (state is FetchMostLikedPropertiesFailure) {
          return Text(state.error.error.toString());
        }
        if (state is FetchMostLikedPropertiesSuccess) {
          return GridView.builder(
            shrinkWrap: true,
            padding: const EdgeInsets.symmetric(
              horizontal: sidePadding,
            ),
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCountAndFixedHeight(
                    mainAxisSpacing: 15, crossAxisCount: 2, height: 260),
            itemCount: state.properties.length.clamp(0, 4),
            itemBuilder: (context, index) {
              PropertyModel property = state.properties[index];

              property = context.watch<PropertyEditCubit>().get(property);

              return GestureDetector(
                onTap: () {
                  HelperUtils.goToNextPage(
                      Routes.propertyDetails, context, false,
                      args: {
                        'propertyData': property,
                        'propertiesList': state.properties,
                        'fromMyProperty': false,
                      });
                },
                child: BlocProvider(
                  create: (context) => AddToFavoriteCubitCubit(),
                  child: PropertyCardBig(
                    showEndPadding: false,
                    isFirst: index == 0,
                    onLikeChange: (type) {
                      if (type == FavoriteType.add) {
                        context.read<FetchFavoritesCubit>().add(property);
                      } else {
                        context.read<FetchFavoritesCubit>().remove(property.id);
                      }
                    },
                    property: property,
                  ),
                ),
              );
            },
          );
        }

        return Container();
      },
    );
  }

  Widget buildNearByProperties() {
    return BlocConsumer<FetchNearbyPropertiesCubit, FetchNearbyPropertiesState>(
      listener: (context, state) {
        if (state is FetchNearbyPropertiesFailure) {
          if (state.error is ApiException) {
            homeStateListener.setNetworkState(
                setState, !(state.error.error == "no-internet"));
          }

          setState(() {});
        }
        if (state is FetchNearbyPropertiesSuccess) {
          setState(() {});
        }
      },
      builder: (context, state) {
        if (state is FetchNearbyPropertiesInProgress) {
          return Column(
            children: [
              TitleHeader(
                onSeeAll: _onTapNearByPropertiesAll,
                title: "${UiUtils.getTranslatedLabel(
                  context,
                  "nearByProperties",
                )}(${HiveUtils.getCityName()})",
              ),
              const NearbyPropertiesShimmer(),
            ],
          );
        }

        if (state is FetchNearbyPropertiesFailure) {
          return Text(state.error.error.toString());
        }
        if (state is FetchNearbyPropertiesSuccess) {
          if (state.properties.isEmpty) {
            return Container();
          }

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TitleHeader(
                onSeeAll: _onTapNearByPropertiesAll,
                title: "${UiUtils.getTranslatedLabel(
                  context,
                  "nearByProperties",
                )}(${HiveUtils.getCityName()})",
              ),
              SizedBox(
                height: 200,
                child: ListView.builder(
                    shrinkWrap: true,
                    padding: const EdgeInsets.symmetric(
                      horizontal: sidePadding,
                    ),
                    physics: const BouncingScrollPhysics(),
                    itemCount: state.properties.length.clamp(0, 6),
                    scrollDirection: Axis.horizontal,
                    itemBuilder: (context, index) {
                      PropertyModel model = state.properties[index];
                      model = context.watch<PropertyEditCubit>().get(model);
                      return PropertyGradiendCard(
                        model: model,
                        isFirst: index == 0,
                        showEndPadding: false,
                      );
                    }),
              ),
            ],
          );
        }

        return Container();
      },
    );
  }

  Widget buildMostViewedProperties() {
    return BlocConsumer<FetchMostViewedPropertiesCubit,
        FetchMostViewedPropertiesState>(
      listener: (context, state) {
        if (state is FetchMostViewedPropertiesFailure) {
          if (state.error is ApiException) {
            homeStateListener.setNetworkState(
                setState, !(state.error.error == "no-internet"));
          }
          setState(() {});
        }
        if (state is FetchMostViewedPropertiesSuccess) {
          homeStateListener.setNetworkState(setState, true);
          setState(() {});
        }
      },
      builder: (context, state) {
        if (state is FetchMostViewedPropertiesInProgress) {
          return const MostViewdPropertiesShimmer();
        }

        if (state is FetchMostViewedPropertiesFailure) {
          return Text(state.error.error.toString());
        }
        if (state is FetchMostViewedPropertiesSuccess) {
          return GridView.builder(
            shrinkWrap: true,
            padding: const EdgeInsets.symmetric(
              horizontal: sidePadding,
            ),
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCountAndFixedHeight(
                    mainAxisSpacing: 15, crossAxisCount: 2, height: 260),
            itemCount: state.properties.length.clamp(0, 4),
            itemBuilder: (context, index) {
              PropertyModel property = state.properties[index];
              property = context.watch<PropertyEditCubit>().get(property);
              return GestureDetector(
                onTap: () {
                  HelperUtils.goToNextPage(
                      Routes.propertyDetails, context, false,
                      args: {
                        'propertyData': property,
                        'propertiesList': state.properties,
                        'fromMyProperty': false,
                      });
                },
                child: BlocProvider(
                  create: (context) => AddToFavoriteCubitCubit(),
                  child: PropertyCardBig(
                    showEndPadding: false,
                    isFirst: index == 0,
                    onLikeChange: (type) {
                      if (type == FavoriteType.add) {
                        context.read<FetchFavoritesCubit>().add(property);
                      } else {
                        context.read<FetchFavoritesCubit>().remove(property.id);
                      }
                    },
                    property: property,
                  ),
                ),
              );
            },
          );
        }

        return Container();
      },
    );
  }

  Widget categoryWidget() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        SizedBox(
          height: 44.rh(context),
          child: BlocConsumer<FetchCategoryCubit, FetchCategoryState>(
            listener: (context, state) {
              if (state is FetchCategoryFailure) {
                if (state.errorMessage == "auth-expired") {
                  HelperUtils.showSnackBarMessage(context,
                      UiUtils.getTranslatedLabel(context, "authExpired"));

                  HiveUtils.logoutUser(
                    context,
                    onLogout: () {},
                  );
                }
              }

              if (state is FetchCategorySuccess) {
                isCategoryEmpty = state.categories.isEmpty;
                setState(() {});
              }
            },
            builder: (context, state) {
              if (state is FetchCategoryInProgress) {
                return const CategoryShimmer();
              }
              if (state is FetchCategoryFailure) {
                return Center(
                  child: Text(state.errorMessage.toString()),
                );
              }
              if (state is FetchCategorySuccess) {
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(
                    horizontal: sidePadding,
                  ),
                  physics: const BouncingScrollPhysics(),
                  scrollDirection: Axis.horizontal,
                  itemCount: state.categories.length
                      .clamp(0, Constant.maxCategoryLength),
                  itemBuilder: (context, index) {
                    Category category = state.categories[index];
                    Constant.propertyFilter = null;
                    if (index == (Constant.maxCategoryLength - 1)) {
                      return Padding(
                        padding: const EdgeInsetsDirectional.only(start: 5.0),
                        child: GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, Routes.categories);
                          },
                          child: Container(
                            constraints: BoxConstraints(
                              minWidth: 100.rw(context),
                            ),
                            height: 44.rh(context),
                            alignment: Alignment.center,
                            decoration: DesignConfig.boxDecorationBorder(
                              color: context.color.secondaryColor,
                              radius: 10,
                              borderWidth: 1.5,
                              borderColor: context.color.borderColor,
                            ),
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10),
                              child: Text(
                                  UiUtils.getTranslatedLabel(context, "more")),
                            ),
                          ),
                        ),
                      );
                    }

                    return buildCategoryCard(context, category, index != 0);
                  },
                );
              }
              return Container();
            },
          ),
        ),
      ],
    );
  }

  Widget buildCategoryCard(
      BuildContext context, Category category, bool? frontSpacing) {
    return CategoryCard(
        frontSpacing: frontSpacing,
        onTapCategory: (category) {
          currentVisitingCategoryId = category.id;
          currentVisitingCategory = category;
          Navigator.of(context).pushNamed(Routes.propertiesList,
              arguments: {'catID': category.id, 'catName': category.category});
        },
        category: category);
  }
}

class RecentPropertiesSectionWidget extends StatefulWidget {
  const RecentPropertiesSectionWidget({Key? key}) : super(key: key);

  @override
  State<RecentPropertiesSectionWidget> createState() =>
      _RecentPropertiesSectionWidgetState();
}

class _RecentPropertiesSectionWidgetState
    extends State<RecentPropertiesSectionWidget> {
  void _onRecentlyAddedSeeAll() {
    dynamic statemap = StateMap<
        FetchRecentProepertiesInitial,
        FetchRecentPropertiesInProgress,
        FetchRecentPropertiesSuccess,
        FetchRecentPropertiesFailur>();
    ViewAllScreen<FetchRecentPropertiesCubit, FetchRecentPropertiesState>(
      title: "recentlyAdded".translate(context),
      map: statemap,
    ).open(context);
  }

  @override
  Widget build(BuildContext context) {
    bool isRecentEmpty() {
      if (context.watch<FetchRecentPropertiesCubit>().state
          is FetchRecentPropertiesSuccess) {
        return (context.watch<FetchRecentPropertiesCubit>().state
                as FetchRecentPropertiesSuccess)
            .properties
            .isEmpty;
      }

      return true;
    }

    return Column(
      children: [
        if (!isRecentEmpty())
          TitleHeader(
            enableShowAll: false,
            title: "recentlyAdded".translate(context),
            onSeeAll: () {
              _onRecentlyAddedSeeAll();
            },
          ),
        LayoutBuilder(builder: (context, c) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: sidePadding),
            child: BlocBuilder<FetchRecentPropertiesCubit,
                FetchRecentPropertiesState>(builder: (context, state) {
              if (state is FetchRecentPropertiesInProgress) {
                return ListView.builder(
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          const ClipRRect(
                            clipBehavior: Clip.antiAliasWithSaveLayer,
                            borderRadius: BorderRadius.all(Radius.circular(15)),
                            child: CustomShimmer(height: 90, width: 90),
                          ),
                          const SizedBox(
                            width: 10,
                          ),
                          Expanded(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                const SizedBox(
                                  height: 10,
                                ),
                                CustomShimmer(
                                  height: 10,
                                  width: c.maxWidth - 100,
                                ),
                                const SizedBox(
                                  height: 10,
                                ),
                                const CustomShimmer(
                                  height: 10,
                                ),
                                const SizedBox(
                                  height: 10,
                                ),
                                CustomShimmer(
                                  height: 10,
                                  width: c.maxWidth / 1.2,
                                ),
                                const SizedBox(
                                  height: 10,
                                ),
                                CustomShimmer(
                                  height: 10,
                                  width: c.maxWidth / 4,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                  shrinkWrap: true,
                  itemCount: 5,
                );
              }

              if (state is FetchRecentPropertiesSuccess) {
                return ListView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  itemBuilder: (context, index) {
                    PropertyModel modal = state.properties[index];
                    modal = context.watch<PropertyEditCubit>().get(modal);
                    return GestureDetector(
                        onTap: () {
                          HelperUtils.goToNextPage(
                            Routes.propertyDetails,
                            context,
                            false,
                            args: {
                              'propertyData': modal,
                              'propertiesList': state.properties,
                              'fromMyProperty': false,
                            },
                          );
                        },
                        child: PropertyHorizontalCard(
                          property: modal,
                          additionalImageWidth: 10,
                        ));
                  },
                  itemCount: state.properties.length.clamp(0, 4),
                  shrinkWrap: true,
                );
              }
              if (state is FetchRecentPropertiesFailur) {
                return Container();
              }

              return Container();
            }),
          );
        }),
      ],
    );
  }
}

class PersonalizedPropertyWidget extends StatelessWidget {
  const PersonalizedPropertyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FetchPersonalizedPropertyList,
        FetchPersonalizedPropertyListState>(
      builder: (context, state) {
        if (state is FetchPersonalizedPropertyInProgress) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TitleHeader(
                onSeeAll: () {},
                title: "personalizedFeed".translate(context),
              ),
              PromotedPropertiesShimmer(),
            ],
          );
        }

        if (state is FetchPersonalizedPropertySuccess) {
          if (state.properties.isEmpty) return const SizedBox.shrink();
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TitleHeader(
                onSeeAll: () {
                  StateMap stateMap = StateMap<
                      FetchPersonalizedPropertyInitial,
                      FetchPersonalizedPropertyInProgress,
                      FetchPersonalizedPropertySuccess,
                      FetchPersonalizedPropertyFail>();

                  ViewAllScreen<FetchPersonalizedPropertyList,
                      FetchPersonalizedPropertyListState>(
                    title: "personalizedFeed".translate(context),
                    map: stateMap,
                  ).open(context);
                },
                title: "personalizedFeed".translate(context),
              ),
              SizedBox(
                height: 261,
                child: ListView.builder(
                  itemCount: state.properties.length.clamp(0, 6),
                  shrinkWrap: true,
                  padding: const EdgeInsets.symmetric(
                    horizontal: sidePadding,
                  ),
                  physics: const BouncingScrollPhysics(),
                  scrollDirection: Axis.horizontal,
                  itemBuilder: (context, index) {
                    GlobalKey thisITemkye = GlobalKey();

                    PropertyModel propertymodel = state.properties[index];
                    propertymodel =
                        context.watch<PropertyEditCubit>().get(propertymodel);
                    return GestureDetector(
                        onTap: () {
                          FirebaseAnalytics.instance
                              .logEvent(name: "preview_property", parameters: {
                            "user_ids": HiveUtils.getUserId(),
                            "from_section": "featured",
                            "property_id": propertymodel.id,
                            "category_id": propertymodel.category!.id
                          });

                          HelperUtils.goToNextPage(
                            Routes.propertyDetails,
                            context,
                            false,
                            args: {
                              'propertyData': propertymodel,
                              'propertiesList': state.properties,
                              'fromMyProperty': false,
                            },
                          );
                        },
                        child: BlocProvider(
                          create: (context) {
                            return AddToFavoriteCubitCubit();
                          },
                          child: PropertyCardBig(
                            key: thisITemkye,
                            isFirst: index == 0,
                            property: propertymodel,
                            onLikeChange: (type) {
                              if (type == FavoriteType.add) {
                                context
                                    .read<FetchFavoritesCubit>()
                                    .add(propertymodel);
                              } else {
                                context
                                    .read<FetchFavoritesCubit>()
                                    .remove(state.properties[index].id);
                              }
                            },
                          ),
                        ));
                  },
                ),
              ),
            ],
          );
        }

        return Container();
      },
    );
  }
}

Future<void> notificationPermissionChecker() async {
  if (!(await Permission.notification.isGranted)) {
    await Permission.notification.request();
  }
}

extension mMap on Map {
  Map get(String key) {
    var m = this[key];
    if (m is Map) {
      return m;
    } else {
      throw "Child is not map";
    }
  }

  Map where(String query) {
    final parts = query.split('=');
    if (parts.length == 2) {
      final key = parts[0].trim();
      final value = parts[1].replaceAll(RegExp(r"^\s*'|\s*'$"), '').trim();

      return Map.fromEntries(entries.where((entry) {
        final entryKey = entry.key.toString();
        final entryValue = entry.value.toString();

        return entryKey == key && entryValue == value;
      }));
    } else {
      throw "Invalid query format";
    }
  }
}
