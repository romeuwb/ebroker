// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:ebroker/Ui/screens/widgets/AnimatedRoutes/blur_page_route.dart';
import 'package:ebroker/Ui/screens/widgets/BottomSheets/choose_location_bottomsheet.dart';
import 'package:ebroker/app/routes.dart';
import 'package:ebroker/data/cubits/category/fetch_category_cubit.dart';
import 'package:ebroker/data/model/category.dart';
import 'package:ebroker/data/model/propery_filter_model.dart';
import 'package:ebroker/utils/AdMob/bannerAdLoadWidget.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/responsiveSize.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../../data/model/google_place_model.dart';
import '../../utils/api.dart';
import '../../utils/constant.dart';
import '../../utils/ui_utils.dart';
import 'main_activity.dart';

dynamic city = "";
dynamic _state = "";
dynamic country = "";

class FilterScreen extends StatefulWidget {
  final bool? showPropertyType;
  const FilterScreen({
    Key? key,
    this.showPropertyType,
  }) : super(key: key);

  @override
  FilterScreenState createState() => FilterScreenState();

  static Route route(RouteSettings routeSettings) {
    Map? arguments = routeSettings.arguments as Map?;
    return BlurredRouter(
      builder: (_) => FilterScreen(
        showPropertyType: arguments?['showPropertyType'],
      ),
    );
  }
}

class FilterScreenState extends State<FilterScreen> {
  TextEditingController minController =
      TextEditingController(text: Constant.propertyFilter?.minPrice);
  TextEditingController maxController =
      TextEditingController(text: Constant.propertyFilter?.maxPrice);

  //String properyType = Constant.valSellBuy;
  String properyType = Constant.propertyFilter?.propertyType ?? "";
  String postedOn = Constant.propertyFilter?.postedSince ??
      Constant.filterAll; // = 2; // 0: last_week   1: yesterday
  dynamic defaultCategoryID = currentVisitingCategoryId;
  dynamic defaultCategory = currentVisitingCategory;

  @override
  void dispose() {
    minController.dispose();
    maxController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();

    setDefaultVal(isrefresh: false);
  }

  void setDefaultVal({bool isrefresh = true}) {
    if (isrefresh) {
      postedOn = Constant.filterAll;
      Constant.propertyFilter = null;
      searchbody[Api.postedSince] = Constant.filterAll;
      properyType = "";
      selectedcategoryId = "0";
      city = "";
      _state = "";
      country = "";
      selectedcategoryName = "";
      selectedCategory = defaultCategory;

      minController.clear();
      maxController.clear();
      checkFilterValSet();
    }
  }

  bool checkFilterValSet() {
    if (postedOn != Constant.filterAll ||
        properyType.isNotEmpty ||
        minController.text.trim().isNotEmpty ||
        maxController.text.trim().isNotEmpty ||
        selectedCategory != defaultCategory) {
      return true;
    }

    return false;
  }

  void _onTapChooseLocation() async {
    FocusManager.instance.primaryFocus?.unfocus();
    var result = await showModalBottomSheet(
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20), topRight: Radius.circular(20))),
      context: context,
      builder: (context) {
        return const ChooseLocatonBottomSheet();
      },
    );
    if (result != null) {
      GooglePlaceModel place = (result as GooglePlaceModel);

      city = place.city;
      country = place.country;
      _state = place.state;
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        checkFilterValSet();
        return true;
      },
      child: Scaffold(
        backgroundColor: Theme.of(context).colorScheme.primaryColor,
        appBar: UiUtils.buildAppBar(
          context,
          onbackpress: () {
            checkFilterValSet();
          },
          showBackButton: true,
          title: UiUtils.getTranslatedLabel(context, "filterTitle"),
          actions: [
            if ((checkFilterValSet() == true)) ...[
              FittedBox(
                fit: BoxFit.none,
                child: UiUtils.buildButton(
                  context,
                  onPressed: () {
                    setDefaultVal(isrefresh: true);
                    setState(() {});
                  },
                  width: 100,
                  height: 50,
                  fontSize: context.font.normal,
                  buttonColor: context.color.secondaryColor,
                  showElevation: false,
                  textColor: context.color.textColorDark,
                  buttonTitle: UiUtils.getTranslatedLabel(
                    context,
                    "clearfilter",
                  ),
                ),
              )
            ]
          ],
        ),
        bottomNavigationBar: BottomAppBar(
          child: UiUtils.buildButton(context,
              outerPadding:
                  const EdgeInsets.symmetric(horizontal: 13, vertical: 5),
              height: 50.rh(context), onPressed: () {
            //this will set name of previous screen app bar

            if (widget.showPropertyType ?? false) {
              if (selectedCategory == null) {
                selectedcategoryName = "";
              } else {
                selectedcategoryName =
                    (selectedCategory as Category).category ?? "";
              }
            }

            Constant.propertyFilter = PropertyFilterModel(
              propertyType: properyType,
              maxPrice: maxController.text,
              minPrice: minController.text,
              categoryId: ((selectedCategory is String)
                      ? selectedCategory
                      : selectedCategory?.id) ??
                  "",
              postedSince: postedOn,
              city: city,
              state: _state,
              country: country,
            );

            Navigator.pop(context, true);
          }, buttonTitle: UiUtils.getTranslatedLabel(context, "applyFilter")),
        ),
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          child: Padding(
            padding: const EdgeInsets.all(
              20.0,
            ),
            child: SizedBox(
              height: context.screenHeight,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  const SizedBox(height: 10),
                  buyORsellOption(),
                  const SizedBox(height: 15),
                  if (widget.showPropertyType ?? true) ...[
                    Text(UiUtils.getTranslatedLabel(context, "proeprtyType"))
                        .size(context.font.large),
                    const SizedBox(height: 15),
                    BlocBuilder<FetchCategoryCubit, FetchCategoryState>(
                      builder: (context, state) {
                        if (state is FetchCategorySuccess) {
                          List<Category> categoriesList =
                              List.from(state.categories);
                          categoriesList.insert(0, Category(id: ""));
                          return SizedBox(
                            height: 50,
                            child: ListView(
                              physics: const BouncingScrollPhysics(),
                              scrollDirection: Axis.horizontal,
                              shrinkWrap: true,
                              children: List.generate(
                                categoriesList.length.clamp(0, 8),
                                (int index) {
                                  if (index == 0) {
                                    return allCategoriesFilterButton(context);
                                  }

                                  if (index == 7) {
                                    return Padding(
                                      padding: const EdgeInsetsDirectional.only(
                                          start: 5.0),
                                      child: moreCategoriesButton(context),
                                    );
                                  }
                                  return GestureDetector(
                                    onTap: () {
                                      selectedCategory = categoriesList[index];
                                      setState(() {});
                                    },
                                    child: Padding(
                                      padding: const EdgeInsets.all(1.0),
                                      child: Container(
                                        alignment: Alignment.center,
                                        decoration: BoxDecoration(
                                          color: selectedCategory ==
                                                  categoriesList[index]
                                              ? context.color.tertiaryColor
                                              : context.color.secondaryColor,
                                          borderRadius:
                                              BorderRadius.circular(10),
                                          border: Border.all(
                                            width: 1.5,
                                            color: context.color.borderColor,
                                          ),
                                        ),
                                        height: 30,
                                        child: Padding(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 16.0, vertical: 8),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceEvenly,
                                            children: [
                                              UiUtils.imageType(
                                                categoriesList[index].image!,
                                                height: 20.rh(context),
                                                width: 20.rw(context),
                                                color: selectedCategory ==
                                                        categoriesList[index]
                                                    ? context
                                                        .color.secondaryColor
                                                    : context
                                                        .color.tertiaryColor,
                                              ),
                                              SizedBox(
                                                width: 10.rw(context),
                                              ),
                                              Text(
                                                categoriesList[index]
                                                    .category
                                                    .toString(),
                                              ).color(selectedCategory ==
                                                      categoriesList[index]
                                                  ? context.color.textAutoAdapt(
                                                      context
                                                          .color.tertiaryColor)
                                                  : context
                                                      .color.textColorDark),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          );
                        }
                        return Container();
                      },
                    ),
                    const SizedBox(
                      height: 15,
                    ),
                  ],
                  Text(UiUtils.getTranslatedLabel(context, 'budgetLbl')),
                  const SizedBox(height: 10),
                  budgetOption(),
                  const SizedBox(height: 10),
                  const SizedBox(height: 5),
                  postedSinceOption(),
                  const SizedBox(height: 15),
                  Text(UiUtils.getTranslatedLabel(context, 'locationLbl')),
                  const SizedBox(height: 5),
                  locationWidget(context),
                  const SizedBox(
                    height: 15,
                  ),
                  const BannerAdWidget(bannerSize: AdSize.banner,)
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget locationWidget(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10.0),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 55,
              decoration: BoxDecoration(
                  color: context.color.textLightColor.withOpacity(00.01),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: context.color.borderColor,
                    width: 1.5,
                  )),
              child: Row(
                children: [
                  Padding(
                    padding: const EdgeInsetsDirectional.only(start: 10.0),
                    child: Align(
                        alignment: Alignment.centerLeft,
                        child: (city != "" && city != null)
                            ? Text("$city,$_state,$country")
                            : Text(UiUtils.getTranslatedLabel(
                                context, "selectLocationOptional"))),
                  ),
                  const Spacer(),
                  if (city != "" && city != null)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(end: 10.0),
                      child: GestureDetector(
                        onTap: _onTapChooseLocation,
                        child: Icon(
                          Icons.close,
                          color: context.color.textColorDark,
                        ),
                      ),
                    )
                ],
              ),
            ),
          ),
          const SizedBox(
            width: 10,
          ),
          GestureDetector(
            onTap: _onTapChooseLocation,
            child: Container(
              height: 55,
              width: 55,
              decoration: BoxDecoration(
                  color: context.color.textLightColor.withOpacity(00.01),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: context.color.borderColor,
                    width: 1.5,
                  )),
              child: Icon(
                Icons.location_searching_sharp,
                color: context.color.tertiaryColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget allCategoriesFilterButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        selectedCategory = null;
        setState(() {});
      },
      child: Container(
        width: 50,
        margin: const EdgeInsetsDirectional.only(end: 5),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selectedCategory == null
              ? context.color.tertiaryColor
              : context.color.secondaryColor,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(width: 1.5, color: context.color.borderColor),
        ),
        height: 25,
        child: Text(UiUtils.getTranslatedLabel(context, "lblall")).color(
            selectedCategory == null
                ? context.color.textAutoAdapt(context.color.tertiaryColor)
                : context.color.textColorDark),
      ),
    );
  }

  GestureDetector moreCategoriesButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, Routes.categories,
            arguments: {"from": Routes.filterScreen}).then(
          (dynamic value) {
            if (value != null) {
              selectedCategory = value;
              setState(() {});
            }
          },
        );
      },
      child: Container(
        height: 25,
        width: 100,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: context.color.secondaryColor,
            border: Border.all(
              color: context.color.borderColor,
              width: 1.5,
            )),
        alignment: Alignment.center,
        child: Text(UiUtils.getTranslatedLabel(context, "more")),
      ),
    );
  }

  Widget saveFilter() {
    //save prefs & validate fields & call API
    return IconButton(
        onPressed: () {
          Constant.propertyFilter = PropertyFilterModel(
            propertyType: properyType,
            maxPrice: maxController.text,
            city: city,
            state: _state,
            country: country,
            minPrice: minController.text,
            categoryId: selectedCategory?.id ?? "",
            postedSince: postedOn,
          );

          Navigator.pop(context, true);
        },
        icon: const Icon(Icons.check));
  }

  Widget buyORsellOption() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          decoration: BoxDecoration(
              color: context.color.tertiaryColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(15)),
          child: SizedBox(
            width: MediaQuery.of(context).size.width - 40.rw(context),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                //buttonSale
                Expanded(
                  child: SizedBox(
                    height: 46.rh(context),
                    child: UiUtils.buildButton(context, onPressed: () {
                      if (properyType == Constant.valSellBuy) {
                        searchbody[Api.propertyType] = "";
                        properyType = "";
                        setState(() {});
                      } else {
                        setPropertyType(Constant.valSellBuy);
                      }
                    },
                        showElevation: false,
                        textColor: properyType == Constant.valSellBuy
                            ? context.color.buttonColor
                            : context.color.textColorDark,
                        buttonColor: properyType == Constant.valSellBuy
                            ? Theme.of(context).colorScheme.tertiaryColor
                            : Theme.of(context)
                                .colorScheme
                                .tertiaryColor
                                .withOpacity(0.0),
                        fontSize: context.font.large,
                        buttonTitle: UiUtils.getTranslatedLabel(context,
                            UiUtils.getTranslatedLabel(context, "forSaleLbl"))),
                  ),
                ),
                //buttonRent
                Expanded(
                  child: SizedBox(
                      height: 46.rh(context),
                      child: UiUtils.buildButton(context, onPressed: () {
                        if (properyType == Constant.valRent) {
                          searchbody[Api.propertyType] = "";
                          properyType = "";
                          setState(() {});
                        } else {
                          setPropertyType(Constant.valRent);
                        }
                      },
                          showElevation: false,
                          textColor: properyType == Constant.valRent
                              ? context.color.buttonColor
                              : context.color.textColorDark,
                          buttonColor: properyType == Constant.valRent
                              ? Theme.of(context).colorScheme.tertiaryColor
                              : Theme.of(context)
                                  .colorScheme
                                  .tertiaryColor
                                  .withOpacity(0.0),
                          fontSize: context.font.large,
                          buttonTitle: UiUtils.getTranslatedLabel(
                              context,
                              UiUtils.getTranslatedLabel(
                                  context, "forRentLbl")))),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }

  void setPropertyType(String val) {
    searchbody[Api.propertyType] = val;

    setState(() {
      properyType = val;
    });
  }

  Widget budgetOption() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              minMaxTFF(
                UiUtils.getTranslatedLabel(context, "minLbl"),
              )
            ],
          ),
        ),
        const SizedBox(height: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              minMaxTFF(UiUtils.getTranslatedLabel(context, "maxLbl")),
            ],
          ),
        ),
      ],
    );
  }

  Widget minMaxTFF(String minMax) {
    return Container(
        padding: EdgeInsetsDirectional.only(
            end: minMax == UiUtils.getTranslatedLabel(context, "minLbl")
                ? 5
                : 0),
        alignment: Alignment.center,
        decoration: BoxDecoration(
            borderRadius: const BorderRadius.all(Radius.circular(10)),
            color: Theme.of(context).colorScheme.backgroundColor),
        child: TextFormField(
            controller:
                (minMax == UiUtils.getTranslatedLabel(context, "minLbl"))
                    ? minController
                    : maxController,
            onChanged: ((value) {
              bool isEmpty = value.trim().isEmpty;
              if (minMax == UiUtils.getTranslatedLabel(context, "minLbl")) {
                if (isEmpty && searchbody.containsKey(Api.minPrice)) {
                  searchbody.remove(Api.minPrice);
                } else {
                  searchbody[Api.minPrice] = value;
                }
              } else {
                if (isEmpty && searchbody.containsKey(Api.maxPrice)) {
                  searchbody.remove(Api.maxPrice);
                } else {
                  searchbody[Api.maxPrice] = value;
                }
              }
            }),
            textInputAction: TextInputAction.done,
            decoration: InputDecoration(
                isDense: true,
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: context.color.tertiaryColor)),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide(color: context.color.tertiaryColor)),
                labelStyle: TextStyle(color: context.color.tertiaryColor),
                hintText: "00",
                label: Text(
                  minMax,
                ),
                prefixText: '${Constant.currencySymbol} ',
                prefixStyle: TextStyle(
                    color: Theme.of(context).colorScheme.tertiaryColor),
                fillColor: Theme.of(context).colorScheme.secondaryColor,
                border: const OutlineInputBorder()),
            keyboardType: TextInputType.number,
            style:
                TextStyle(color: Theme.of(context).colorScheme.tertiaryColor),
            /* onSubmitted: () */
            inputFormatters: [FilteringTextInputFormatter.digitsOnly]));
  }

  Widget postedSinceOption() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: <Widget>[
        //     // Text(
        //     setMessageText(
        //         titleTxt: UiUtils.getTranslatedLabel(context, "postedSinceLbl"),
        //         txtColor: Theme.of(context).colorScheme.blackColor,
        //         txtStyle: Theme.of(context).textTheme.titleMedium,
        //         fontWeight: FontWeight.w500,
        //         context: context),
        //     Container(
        //       color: Theme.of(context).colorScheme.blackColor.withOpacity(0.5),
        //       height: 1,
        //       width: MediaQuery.of(context).size.width * 0.45,
        //     ),
        //   ],
        // ),
        Text(UiUtils.getTranslatedLabel(context, "postedSinceLbl"))
            .size(context.font.large),
        SizedBox(
          height: 10.rh(context),
        ),

        SizedBox(
          height: 45,
          child: ListView(
            shrinkWrap: true,
            scrollDirection: Axis.horizontal,
            children: <Widget>[
              UiUtils.buildButton(
                context,
                fontSize: context.font.small,
                showElevation: false,
                autoWidth: true,
                border:
                    BorderSide(color: context.color.borderColor, width: 1.5),
                buttonColor: searchbody[Api.postedSince] == Constant.filterAll
                    ? context.color.tertiaryColor
                    : context.color.tertiaryColor.withOpacity(0.05),
                textColor: searchbody[Api.postedSince] == Constant.filterAll
                    ? context.color.secondaryColor
                    : context.color.textColorDark,
                buttonTitle: UiUtils.getTranslatedLabel(context, "anytimeLbl"),
                onPressed: () {
                  onClickPosted(
                    Constant.filterAll,
                  );
                  setState(() {});
                },
              ),
              SizedBox(
                width: 5.rw(context),
              ),
              UiUtils.buildButton(
                fontSize: context.font.small,
                context,
                autoWidth: true,
                border:
                    BorderSide(color: context.color.borderColor, width: 1.5),
                textColor:
                    searchbody[Api.postedSince] == Constant.filterLastWeek
                        ? context.color.secondaryColor
                        : context.color.textColorDark,
                showElevation: false,
                buttonColor:
                    searchbody[Api.postedSince] == Constant.filterLastWeek
                        ? context.color.tertiaryColor
                        : context.color.tertiaryColor.withOpacity(0.05),
                buttonTitle: UiUtils.getTranslatedLabel(context, "lastWeekLbl"),
                onPressed: () {
                  onClickPosted(
                    Constant.filterLastWeek,
                  );
                },
              ),
              SizedBox(
                width: 5.rw(context),
              ),
              UiUtils.buildButton(
                fontSize: context.font.small,
                context,
                autoWidth: true,
                border:
                    BorderSide(color: context.color.borderColor, width: 1.5),
                showElevation: false,
                textColor:
                    searchbody[Api.postedSince] == Constant.filterYesterday
                        ? context.color.secondaryColor
                        : context.color.textColorDark,
                buttonColor:
                    searchbody[Api.postedSince] == Constant.filterYesterday
                        ? context.color.tertiaryColor
                        : context.color.tertiaryColor.withOpacity(0.05),
                buttonTitle:
                    UiUtils.getTranslatedLabel(context, "yesterdayLbl"),
                onPressed: () {
                  onClickPosted(
                    Constant.filterYesterday,
                  );
                },
              ),
            ],
          ),
        )
      ],
    );
  }

  void onClickPosted(String val) {
    if (val == Constant.filterAll && searchbody.containsKey(Api.postedSince)) {
      searchbody[Api.postedSince] = "";
    } else {
      searchbody[Api.postedSince] = val;
    }

    postedOn = val;
    setState(() {});
  }
}
