// ignore: unused_import
import 'dart:developer';

import 'package:ebroker/Ui/screens/home/Widgets/property_card_big.dart';
import 'package:ebroker/Ui/screens/widgets/AnimatedRoutes/blur_page_route.dart';
import 'package:ebroker/Ui/screens/widgets/promoted_widget.dart';
import 'package:ebroker/data/cubits/property/create_advertisement_cubit.dart';
import 'package:ebroker/data/cubits/property/fetch_my_properties_cubit.dart';
import 'package:ebroker/data/cubits/subscription/get_subsctiption_package_limits_cubit.dart';
import 'package:ebroker/data/cubits/system/fetch_system_settings_cubit.dart';
import 'package:ebroker/data/helper/widgets.dart';
import 'package:ebroker/data/model/property_model.dart';
import 'package:ebroker/data/model/system_settings_model.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/helper_utils.dart';
import 'package:ebroker/utils/imagePicker.dart';
import 'package:ebroker/utils/responsiveSize.dart';
import 'package:ebroker/utils/ui_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../utils/constant.dart';

enum AvertisementType {
  home("HomeScreen"),
  slider("Slider"),
  list("ProductListing");

  final String value;
  const AvertisementType(this.value);
}

class CreateAdvertisementScreen extends StatefulWidget {
  final PropertyModel property;
  const CreateAdvertisementScreen({
    super.key,
    required this.property,
  });
  static Route route(RouteSettings settings) {
    Map? arguments = settings.arguments as Map?;
    return BlurredRouter(
      builder: (context) => MultiBlocProvider(
        providers: [
          BlocProvider(
            create: (context) => CreateAdvertisementCubit(),
          ),
          BlocProvider(
            create: (context) => GetSubsctiptionPackageLimitsCubit(),
          ),
        ],
        child: CreateAdvertisementScreen(
          property: arguments?['model'],
        ),
      ),
    );
  }

  @override
  State<CreateAdvertisementScreen> createState() =>
      _CreateAdvertisementScreenState();
}

class _CreateAdvertisementScreenState extends State<CreateAdvertisementScreen> {
  Map? selectedAdvertismentOption;
  final PickImage _pickImage = PickImage();
  AvertisementType advertisementType = AvertisementType.home;
  bool isAdvertisementCreationLimitReached = true;
  bool isPackageAvailableForAdvertismnet = false;
  Widget getPreview() {
    if (selectedAdvertismentOption?['id'] == 0 ||
        selectedAdvertismentOption == null) {
      return Transform.scale(
          scale: 0.8, child: PropertyCardBig(property: widget.property));
    } else if (selectedAdvertismentOption?['id'] == 1) {
      return LayoutBuilder(builder: (context, c) {
        return Container(
          width: context.screenWidth - 100,
          height: 150,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(
              11,
            ),
          ),
          child: Stack(
            fit: StackFit.expand,
            children: [
              _pickImage.listenChangesInUI(
                (context, image) {
                  if (image != null) {
                    return Image.file(
                      _pickImage.pickedFile!,
                      fit: BoxFit.cover,
                    );
                  }

                  if (widget.property.titleImage == "") {
                    return UiUtils.getImage(widget.property.titleImage!);
                  }
                  return Image.network(
                    widget.property.titleImage ?? "",
                    fit: BoxFit.cover,
                  );
                },
              ),
              const Positioned(
                left: 10,
                top: 10,
                child: PromotedCard(type: PromoteCardType.icon),
              )
            ],
          ),
        );
      });
    } else {
      return Text(UiUtils.getTranslatedLabel(context, "previewNotAvail"));
    }
  }

  Future<void> _createAdvertisment() async {
    var setting = context.read<FetchSystemSettingsCubit>().getSetting(
          SystemSetting.subscription,
        );

    String packageId = setting[0]['package_id'].toString();

    if (selectedAdvertismentOption?['id'] == 0) {
      advertisementType = AvertisementType.home;
    } else if (selectedAdvertismentOption?['id'] == 1) {
      advertisementType = AvertisementType.slider;
    } else if (selectedAdvertismentOption?['id'] == 2) {
      advertisementType = AvertisementType.list;
    }

    context.read<CreateAdvertisementCubit>().create(
        type: advertisementType.value,
        propertyId: widget.property.id.toString(),
        packageId: packageId,
        image: _pickImage.pickedFile);
  }

  @override
  void dispose() {
    _pickImage.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    Future.delayed(
      const Duration(milliseconds: 500),
      () {
        if (Constant.subscriptionPackageId != null) {
          context
              .read<GetSubsctiptionPackageLimitsCubit>()
              .getLimits(Constant.subscriptionPackageId!);
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    var setting = context
        .watch<FetchSystemSettingsCubit>()
        .getSetting(SystemSetting.subscription);
    context.watch<GetSubsctiptionPackageLimitsCubit>().state;
    return Scaffold(
      backgroundColor: context.color.backgroundColor,
      appBar: UiUtils.buildAppBar(
        context,
        showBackButton: true,
        title: UiUtils.getTranslatedLabel(context, "createAdvertisment"),
      ),
      bottomNavigationBar: BlocConsumer<GetSubsctiptionPackageLimitsCubit,
          GetSubsctiptionPackageLimitsState>(
        listener: (context, state) {
          if (state is GetSubsctiptionPackageLimitsInProgress) {
            Widgets.showLoader(context);
          }

          if (state is GetSubsctiptionPackageLimitsFailure) {
            Widgets.hideLoder(context);
            HelperUtils.showSnackBarMessage(context,
                UiUtils.getTranslatedLabel(context, "somethingWentWrng"),
                type: MessageType.error);
            Navigator.pop(context);
          }
          if (state is GetSubsctiptionPackageLimitsSuccess) {
            Widgets.hideLoder(context);
          }
        },
        builder: (context, state) {
          if (state is GetSubsctiptionPackageLimitsSuccess) {
            if (state.packageLimit.totalLimitOfAdvertisement.runtimeType ==
                int) {
              isAdvertisementCreationLimitReached =
                  (state.packageLimit.usedLimitOfAdvertisement ==
                      state.packageLimit.totalLimitOfAdvertisement);
            } else {
              isAdvertisementCreationLimitReached = false;
            }

            isPackageAvailableForAdvertismnet =
                state.packageLimit.totalLimitOfAdvertisement != "not_available";
          }
          if (state is GetSubsctiptionPackageLimitsFailure) {}
          return Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(20, 0, 20, 8),
            child: UiUtils.buildButton(context, onPressed: () {
              _createAdvertisment();
            },
                disabled: setting.isEmpty
                    ? true
                    : ((isAdvertisementCreationLimitReached ||
                            isPackageAvailableForAdvertismnet == false)
                        ? true
                        : false),
                prefixWidget: setting.isEmpty
                    ? Icon(
                        Icons.lock,
                        color: context.color.buttonColor,
                      )
                    : (isAdvertisementCreationLimitReached ||
                            isPackageAvailableForAdvertismnet == false
                        ? Icon(
                            Icons.lock,
                            color: context.color.buttonColor,
                          )
                        : null),
                buttonTitle: setting.isEmpty
                    ? UiUtils.getTranslatedLabel(context, "subscribeToPackage")
                    : ((isAdvertisementCreationLimitReached ||
                            isPackageAvailableForAdvertismnet == false)
                        ? UiUtils.getTranslatedLabel(
                            context, "subscribeToPackage")
                        : UiUtils.getTranslatedLabel(context, "promote"))),
          );

          // return MaterialButton(
          //   disabledColor: Colors.grey,
          //   onPressed: (isAdvertisementCreationLimitReached
          //       ? null
          //       : _createAdvertisment),
          //   height: 45,
          //   color: Theme.of(context).colorScheme.teritoryColor,
          //   child: Row(
          //     mainAxisAlignment: MainAxisAlignment.center,
          //     children: [
          //       if (isAdvertisementCreationLimitReached) ...[
          //         const Icon(Icons.lock),
          //       ],
          //       Text(isAdvertisementCreationLimitReached
          //               ? "Subscribe to package"
          //               : "Promote")
          //           .color(const Color.fromARGB(255, 255, 255, 255)),
          //     ],
          //   ),
          // );
        },
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocConsumer<CreateAdvertisementCubit, CreateAdvertisementState>(
          listener: (context, state) {
            if (state is CreateAdvertisementInProgress) {
              Widgets.showLoader(context);
            }
            if (state is CreateAdvertisementFailure) {
              Widgets.hideLoder(context);
              HelperUtils.showSnackBarMessage(
                context,
                UiUtils.getTranslatedLabel(context, "somethingWentWrng"),
                type: MessageType.error,
              );
            }

            if (state is CreateAdvertisementSuccess) {
              Widgets.hideLoder(context);
              // Constant.promotedProeprtiesIds.add(state.proeprtyId);
              context.read<FetchMyPropertiesCubit>().update(state.property);
              HelperUtils.showSnackBarMessage(
                context,
                UiUtils.getTranslatedLabel(context, "success"),
                type: MessageType.success,
              );
              context
                  .read<GetSubsctiptionPackageLimitsCubit>()
                  .increaseAdvertismentUseCount();
            }
          },
          builder: (context, state) {
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    UiUtils.getTranslatedLabel(context, "preview"),
                  )
                      .size(
                        17,
                      )
                      .color(context.color.textColorDark),
                  SizedBox(
                    height: 15.rh(context),
                  ),
                  Container(
                    height: 300,
                    width: MediaQuery.of(context).size.width,
                    color: const Color.fromARGB(255, 231, 231, 231),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IgnorePointer(ignoring: true, child: getPreview()),
                      ],
                    ),
                  ),
                  OptionsRow(
                    initialValue: (initial) {
                      selectedAdvertismentOption = initial;
                    },
                    selected: (selected) {
                      selectedAdvertismentOption = selected;
                      setState(() {});
                    },
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  if (selectedAdvertismentOption?['id'] == 1)
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Container(
                        width: context.screenWidth,
                        decoration: BoxDecoration(
                            color: context.color.secondaryColor,
                            borderRadius: BorderRadius.circular(10)),
                        height: 48,
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(UiUtils.getTranslatedLabel(
                                  context, "pickSliderImage")),
                              MaterialButton(
                                onPressed: () {
                                  _pickImage.pick();
                                },
                                child: Text(UiUtils.getTranslatedLabel(
                                    context, "uploadBtnLbl")),
                              )
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class OptionsRow extends StatefulWidget {
  final Function(Map<String, dynamic> initial)? initialValue;
  final Function(Map<String, dynamic> selected) selected;
  const OptionsRow({super.key, required this.selected, this.initialValue});
  @override
  State<OptionsRow> createState() => _OptionsRowState();
}

class _OptionsRowState extends State<OptionsRow> {
  int selectedOption = 0;

  ///add options here
  List<String> options = ["Home", "Slider", "List"];

  Widget buildOption(String name, int index) => Expanded(
      child: Padding(
          padding: const EdgeInsets.all(1.0),
          child: UiUtils.buildButton(
            context,
            height: 34,
            buttonTitle: name,
            textColor: index == selectedOption
                ? context.color.textAutoAdapt(context.color.textColorDark)
                : Theme.of(context).colorScheme.textColorDark,
            radius: 7,
            fontSize: context.font.normal,
            onPressed: () {
              selectedOption = index;
              widget.selected({"id": index, "value": name});
              setState(() {});
            },
            buttonColor: index == selectedOption
                ? Theme.of(context).colorScheme.tertiaryColor.withAlpha(255)
                : Theme.of(context).colorScheme.tertiaryColor.withAlpha(50),
          )));

  @override
  void initState() {
    widget.initialValue?.call({"id": 0, "value": options[0]});
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    ///We need index to select some value , So when we are storing it in list
    /// so we don't have index in list we can use for loop but it will not be perfect as this,
    ///  here we are converting list  to map so it will  get index automaticly and then using .map(k,v)
    ///  method so we can get index in key and do work on this
    /// .values will only use its String values and here .cast will convert List dynamic to List of widgets
    List<Widget> optionList = options
        .asMap()
        .map((key, value) => MapEntry(key, buildOption(value, key)))
        .values
        .toList()
        .cast<Widget>();

    return Row(
      children: optionList,
    );
  }
}
