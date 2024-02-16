import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../app/routes.dart';
import '../../../../data/cubits/category/fetch_category_cubit.dart';
import '../../../../data/cubits/outdoorfacility/fetch_outdoor_facility_list.dart';
import '../../../../data/cubits/subscription/get_subsctiption_package_limits_cubit.dart';
import '../../../../data/cubits/system/fetch_system_settings_cubit.dart';
import '../../../../data/helper/widgets.dart';
import '../../../../data/model/category.dart';
import '../../../../data/model/system_settings_model.dart';
import '../../../../utils/Extensions/extensions.dart';
import '../../../../utils/constant.dart';
import '../../../../utils/helper_utils.dart';
import '../../../../utils/responsiveSize.dart';
import '../../../../utils/ui_utils.dart';
import '../../widgets/AnimatedRoutes/blur_page_route.dart';
import '../../widgets/blurred_dialoge_box.dart';

class SelectPropertyType extends StatefulWidget {
  const SelectPropertyType({super.key});

  static Route route(RouteSettings settings) {
    return BlurredRouter(
      builder: (context) {
        return const SelectPropertyType();
      },
    );
  }

  @override
  State<SelectPropertyType> createState() => _SelectPropertyTypeState();
}

class _SelectPropertyTypeState extends State<SelectPropertyType> {
  int? selectedIndex;
  Category? selectedCategory;
  bool isLimitFetched = false;
  bool isDialogeShown = false;
  @override
  void initState() {
    super.initState();
    context.read<FetchOutdoorFacilityListCubit>().fetch();
    Future.delayed(
      Duration.zero,
      () {
        var setting = context
            .read<FetchSystemSettingsCubit>()
            .getSetting(SystemSetting.subscription);

        if (setting is List) {
          if (setting.isEmpty) {
            if (isDialogeShown == false) {
              WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
                UiUtils.showBlurredDialoge(context,
                    sigmaX: 3,
                    sigmaY: 3,
                    dialoge: BlurredDialogBox(
                      isAcceptContainesPush: true,
                      cancelTextColor: context.color.textColorDark,
                      acceptButtonName:
                          UiUtils.getTranslatedLabel(context, "subscribe"),
                      backAllowedButton: false,
                      title: UiUtils.getTranslatedLabel(context, "noPackage"),
                      content: Text(
                        UiUtils.getTranslatedLabel(context, "plsSubscribe"),
                      ),
                      onCancel: () {
                        Navigator.pop(context);
                        setState(() {
                          isDialogeShown = true;
                        });
                      },
                      onAccept: () async {
                        _openSubscriptionScreen();
                        setState(() {
                          isDialogeShown = true;
                        });
                        // Navigator.pop(context, "1");
                      },
                    ));
              });
            }
          } else {
            if (Constant.subscriptionPackageId != null) {
              if (isLimitFetched == false) {
                Future.delayed(
                  const Duration(milliseconds: 100),
                  () {
                    context
                        .read<GetSubsctiptionPackageLimitsCubit>()
                        .getLimits(Constant.subscriptionPackageId!);
                  },
                );
              }
            }
          }
        }
      },
    );
  }

  void _openSubscriptionScreen() {
    Navigator.pushNamed(
      context,
      Routes.subscriptionPackageListRoute,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.color.primaryColor,
      appBar: UiUtils.buildAppBar(context,
          title: UiUtils.getTranslatedLabel(
            context,
            "ddPropertyLbl",
          ),
          actions: const [
            Text("1/4"),
            SizedBox(
              width: 14,
            ),
          ],
          showBackButton: true),
      bottomNavigationBar: Container(
        color: Colors.transparent,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
          child: UiUtils.buildButton(context,
              disabledColor: Colors.grey,
              onTapDisabledButton: () {
                HelperUtils.showSnackBarMessage(
                    context, "pleaseSelectCategory".translate(context),
                    isFloating: true);
              },
              disabled: selectedCategory == null,
              onPressed: () {
                var state =
                    context.read<GetSubsctiptionPackageLimitsCubit>().state;
                if (state is! GetSubsctiptionPackageLimitsInProgress) {
                  Constant.addProperty.addAll({"category": selectedCategory});

                  if (selectedCategory != null) {
                    // Navigator.push(context, MaterialPageRoute(builder: (context) {
                    //   return SelectOutdoorFacility();
                    // },));
                    //TODO:
                    Navigator.pushNamed(
                        context, Routes.addPropertyDetailsScreen);
                  }
                }
              },
              height: 48.rh(context),
              fontSize: context.font.large,
              buttonTitle: UiUtils.getTranslatedLabel(context, "continue")),
        ),
      ),
      body: BlocListener<GetSubsctiptionPackageLimitsCubit,
          GetSubsctiptionPackageLimitsState>(
        bloc: context.read<GetSubsctiptionPackageLimitsCubit>(),
        listener: (context, state) {
          if (state is GetSubsctiptionPackageLimitsInProgress) {
            Widgets.showLoader(context);
          }
          if (state is GetSubsctiptionPackageLimitsFailure) {
            Widgets.hideLoder(context);
            HelperUtils.showSnackBarMessage(
              context,
              state.errorMessage.firstUpperCase(),
              onClose: () {
                Navigator.pop(context);
              },
            );
          }
          if (state is GetSubsctiptionPackageLimitsSuccess) {
            Widgets.hideLoder(context);

            isLimitFetched = true;
            setState(() {});
            if (state.packageLimit.totalLimitOfProperty == "not_available") {
              UiUtils.showBlurredDialoge(context,
                  sigmaX: 3,
                  sigmaY: 3,
                  dialoge: BlurredDialogBox(
                    isAcceptContainesPush: true,
                    acceptButtonName:
                        UiUtils.getTranslatedLabel(context, "subscribe"),
                    backAllowedButton: false,
                    title:
                        UiUtils.getTranslatedLabel(context, "packageNotValid"),
                    content: Text(
                      UiUtils.getTranslatedLabel(
                          context, "packageNotForProperty"),
                    ),
                    onCancel: () {
                      Navigator.pop(context);
                    },
                    onAccept: () async {
                      _openSubscriptionScreen();
                    },
                  ));
            }

            //we are making sure that total number is not in string, if it will be Unlimited so we dont have to show nay dialoge

            if (state.packageLimit.totalLimitOfProperty.runtimeType == int) {
              if (state.packageLimit.usedLimitOfProperty >=
                  state.packageLimit.totalLimitOfProperty) {
                UiUtils.showBlurredDialoge(context,
                    sigmaX: 3,
                    sigmaY: 3,
                    dialoge: BlurredDialogBox(
                      isAcceptContainesPush: true,
                      acceptButtonName:
                          UiUtils.getTranslatedLabel(context, "subscribe"),
                      backAllowedButton: false,
                      title: UiUtils.getTranslatedLabel(
                          context, "yourPackageReachedLimit"),
                      content: Text(
                        UiUtils.getTranslatedLabel(
                            context, "yourPackageReachedLimitDescription"),
                      ),
                      onCancel: () {
                        Navigator.pop(context);
                      },
                      onAccept: () async {
                        _openSubscriptionScreen();
                      },
                    ));
              }
            }
          }
        },
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsetsDirectional.only(
                    start: 20.0, end: 20, top: 20),
                child:
                    Text(UiUtils.getTranslatedLabel(context, "typeOfProperty"))
                        .color(context.color.textColorDark),
              ),
              BlocBuilder<FetchCategoryCubit, FetchCategoryState>(
                builder: (context, state) {
                  if (state is FetchCategoryInProgress) {}
                  if (state is FetchCategoryFailure) {
                    return Center(
                      child: Text(state.errorMessage),
                    );
                  }
                  if (state is FetchCategorySuccess) {
                    return GridView.builder(
                      itemCount: state.categories.length,
                      shrinkWrap: true,
                      padding: const EdgeInsets.all(20.0),
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                              mainAxisSpacing: 10,
                              crossAxisSpacing: 10,
                              crossAxisCount: 3),
                      itemBuilder: (context, index) {
                        return buildTypeCard(
                            index, context, state.categories[index]);
                      },
                    );
                  }
                  return Container();
                },
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget buildTypeCard(int index, BuildContext context, Category category) {
    return GestureDetector(
      onTap: () {
        selectedCategory = category;
        selectedIndex = index;
        setState(() {});
      },
      child: Container(
        decoration: BoxDecoration(
            color: (selectedIndex == index)
                ? context.color.tertiaryColor
                : context.color.secondaryColor,
            borderRadius: BorderRadius.circular(10),
            boxShadow: (selectedIndex == index)
                ? [
                    BoxShadow(
                        offset: const Offset(1, 2),
                        blurRadius: 5,
                        color: context.color.tertiaryColor)
                  ]
                : null,
            border: (selectedIndex == index)
                ? null
                : Border.all(color: context.color.borderColor, width: 1.5)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon(
            //   Icons.house,
            //   color: selectedIndex == index
            //       ? context.color.secondaryColor
            //       : context.color.teritoryColor,
            // ),
            SizedBox(
              height: 25.rh(context),
              width: 25.rw(context),
              child: UiUtils.imageType(category.image!,
                  color: selectedIndex == index
                      ? context.color.secondaryColor
                      : (Constant.adaptThemeColorSvg
                          ? context.color.tertiaryColor
                          : null)),
            ),

            Padding(
              padding: const EdgeInsets.all(2.0),
              child: Text(
                category.category!,
                textAlign: TextAlign.center,
              ).color(selectedIndex == index
                  ? context.color.secondaryColor
                  : context.color.tertiaryColor),
            )
          ],
        ),
      ),
    );
  }
}
