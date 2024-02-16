// ignore_for_file: invalid_use_of_visible_for_testing_member

// ignore_for_file: invalid_use_of_visible_for_testing_member

import 'package:ebroker/Ui/screens/widgets/custom_text_form_field.dart';
import 'package:ebroker/data/cubits/outdoorfacility/fetch_outdoor_facility_list.dart';
import 'package:ebroker/data/model/outdoor_facility.dart';
import 'package:ebroker/data/model/property_model.dart';
import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:ebroker/utils/responsiveSize.dart';
import 'package:ebroker/utils/ui_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../data/cubits/property/create_property_cubit.dart';
import '../../../../utils/constant.dart';
import '../../../../utils/sliver_grid_delegate_with_fixed_cross_axis_count_and_fixed_height.dart';
import '../../widgets/AnimatedRoutes/blur_page_route.dart';

class SelectOutdoorFacility extends StatefulWidget {
  final Map<String, dynamic>? apiParameters;

  const SelectOutdoorFacility({super.key, required this.apiParameters});

  static Route route(RouteSettings settings) {
    Map<String, dynamic> _apiParameters =
        settings.arguments as Map<String, dynamic>;
    return BlurredRouter(
      builder: (context) {
        return SelectOutdoorFacility(
          apiParameters: _apiParameters,
        );
      },
    );
  }

  @override
  State<SelectOutdoorFacility> createState() => _SelectOutdoorFacilityState();
}

class _SelectOutdoorFacilityState extends State<SelectOutdoorFacility> {
  final ValueNotifier<List<int>> _selectedIdsList = ValueNotifier([]);
  List<OutdoorFacility> facilityList = [];
  Map<int, TextEditingController> distanceFieldList = {};
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  var _oldSize;
  @override
  void initState() {
    List<AssignedOutdoorFacility> facilities = [];
    facilities = widget.apiParameters?['assign_facilities'] ?? [];

    // context.read<FetchOutdoorFacilityListCubit>().fetchIfFailed();
    facilityList = context.read<FetchOutdoorFacilityListCubit>().getList();

    setState(() {});
    _selectedIdsList.addListener(() {
      _selectedIdsList.value.forEach((element) {
        if (!distanceFieldList.keys.contains(element)) {
          if (widget.apiParameters?['isUpdate'] ?? false) {
            List<AssignedOutdoorFacility> match =
                facilities.where((x) => x.facilityId == element).toList();

            if (match.isNotEmpty) {
              distanceFieldList[element] =
                  TextEditingController(text: match.first.distance.toString());
            } else {
              distanceFieldList[element] = TextEditingController();
            }
          } else {
            distanceFieldList[element] = TextEditingController();
          }
        }
      });
      setState(() {});
    });

    if (widget.apiParameters?['isUpdate'] ?? false) {
      facilities.forEach((element) {
        if (!_selectedIdsList.value.contains(element)) {
          _selectedIdsList.value.add(element.facilityId!);
          _selectedIdsList.notifyListeners();
        }
      });
    }
    super.initState();
  }

  Map<String, dynamic> assembleOutdoorFacility() {
    Map<String, dynamic> facilitymap = {};
    for (var i = 0; i < distanceFieldList.entries.length; i++) {
      MapEntry element = distanceFieldList.entries.elementAt(i);

      facilitymap.addAll({
        "facilities[$i][facility_id]": element.key,
        "facilities[$i][distance]": element.value.text
      });
    }

    return facilitymap;
  }

  OutdoorFacility getSelectedFacility(int id) {
    try {
      return facilityList
          .where((OutdoorFacility element) => element.id == id)
          .first;
    } catch (e) {
      throw "$e";
    }
  }

  @override
  Widget build(BuildContext context) {
    // log(facilityList.toString());
    bool fetchInProgress = (context.watch<FetchOutdoorFacilityListCubit>().state
        is FetchOutdoorFacilityListInProgress);
    bool fetchFails = (context.watch<FetchOutdoorFacilityListCubit>().state
        is FetchOutdoorFacilityListInProgress);

    return BlocListener<FetchOutdoorFacilityListCubit,
        FetchOutdoorFacilityListState>(
      listener: (context, state) {
        if (state is FetchOutdoorFacilityListSucess) {
          facilityList =
              context.read<FetchOutdoorFacilityListCubit>().getList();
          setState(() {});
        }
      },
      child: Scaffold(
        backgroundColor: context.color.backgroundColor,
        appBar: UiUtils.buildAppBar(context,
            showBackButton: true,
            actions: const [
              Text("4/4"),
              SizedBox(
                width: 14,
              ),
            ],
            title: "selectNearestPlaces".translate(context)),
        bottomNavigationBar: BottomAppBar(
          child: GestureDetector(
            onTap: () {
              distanceFieldList.forEach((element, v) {});
            },
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: UiUtils.buildButton(
                context,
                onPressed: () {
                  Map<String, dynamic>? parameters = widget.apiParameters;

                  ///adding facility data to api payload
                  parameters!.addAll(assembleOutdoorFacility());
                  parameters
                    ..remove("assign_facilities")
                    ..remove("isUpdate");
                  if (_formKey.currentState!.validate()) {
                    context
                        .read<CreatePropertyCubit>()
                        .create(parameters: parameters);
                  }
                },
                buttonTitle: widget.apiParameters?['action_type'] == "0"
                    ? UiUtils.getTranslatedLabel(context, "update")
                    : UiUtils.getTranslatedLabel(context, "submitProperty"),
              ),
            ),
          ),
        ),
        body: Builder(builder: (context) {
          if (fetchInProgress) {
            return Center(
              child: UiUtils.progress(),
            );
          }

          if (fetchFails) {
            return Center(
              child: Text("Something Went wrong"),
            );
          }
          return SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding:
                      const EdgeInsetsDirectional.fromSTEB(15.0, 10, 15, 0),
                  child: Text("selectPlaces".translate(context)),
                ),
                SizedBox(
                  height: 12,
                ),
                BlocBuilder<FetchOutdoorFacilityListCubit,
                    FetchOutdoorFacilityListState>(
                  builder: (context, state) {
                    if (state is FetchOutdoorFacilityListFailure) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 15.0),
                        child: Text(state.error.toString()),
                      );
                    }
                    if (state is FetchOutdoorFacilityListSucess) {
                      return ValueListenableBuilder<List<int>>(
                          valueListenable: _selectedIdsList,
                          builder: (context, List<int> value, child) {
                            return OutdoorFacilityTable(
                              length: state.outdoorFacilityList.length,
                              child: (index) {
                                OutdoorFacility outdoorFacilityList =
                                    state.outdoorFacilityList[index];

                                return buildTypeCard(
                                    index, context, outdoorFacilityList,
                                    onSelect: (id) {
                                  if (_selectedIdsList.value.contains(id)) {
                                    _selectedIdsList.value.remove(id);

                                    ///Dispose and remove from object
                                    distanceFieldList[id]?.dispose();
                                    distanceFieldList.remove(id);
                                    _selectedIdsList.notifyListeners();
                                  } else {
                                    _selectedIdsList.value.add(id);
                                    _selectedIdsList.notifyListeners();
                                  }
                                },
                                    isSelected:
                                        value.contains(outdoorFacilityList.id));
                              },
                            );

                            return GridView.builder(
                              physics: const NeverScrollableScrollPhysics(),
                              padding: const EdgeInsets.all(15),
                              shrinkWrap: true,
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                      mainAxisSpacing: 5,
                                      crossAxisSpacing: 5,
                                      crossAxisCount: 4),
                              itemCount: state.outdoorFacilityList.length,
                              itemBuilder: (context, index) {
                                OutdoorFacility outdoorFacilityList =
                                    state.outdoorFacilityList[index];

                                return buildTypeCard(
                                    index, context, outdoorFacilityList,
                                    onSelect: (id) {
                                  if (_selectedIdsList.value.contains(id)) {
                                    _selectedIdsList.value.remove(id);

                                    ///Dispose and remove from object
                                    distanceFieldList[id]?.dispose();
                                    distanceFieldList.remove(id);
                                    _selectedIdsList.notifyListeners();
                                  } else {
                                    _selectedIdsList.value.add(id);
                                    _selectedIdsList.notifyListeners();
                                  }
                                },
                                    isSelected:
                                        value.contains(outdoorFacilityList.id));
                              },
                            );
                          });
                    }

                    return Container();
                  },
                ),
                ValueListenableBuilder(
                  valueListenable: _selectedIdsList,
                  builder: (context, value, child) {
                    return Padding(
                      padding: const EdgeInsets.all(15.0),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _selectedIdsList.value.isEmpty
                                ? const SizedBox.shrink()
                                : Text("selectedItems".translate(context)),
                            const SizedBox(
                              height: 10,
                            ),
                            ...List.generate(_selectedIdsList.value.length,
                                (index) {
                              if (fetchInProgress) {
                                return const SizedBox.shrink();
                              }

                              OutdoorFacility facility = getSelectedFacility(
                                  _selectedIdsList.value[index]);
                              return Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 3.0),
                                child: OutdoorFacilityDistanceField(
                                  facility: facility,
                                  controller: distanceFieldList[facility.id]!,
                                ),
                              );
                            })
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget buildTypeCard(
      int index, BuildContext context, OutdoorFacility facility,
      {required bool isSelected, required Function(int id) onSelect}) {
    return GestureDetector(
      onTap: () {
        onSelect.call(facility.id!);
      },
      child: Container(
        decoration: BoxDecoration(
            color: isSelected
                ? context.color.tertiaryColor
                : context.color.secondaryColor,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      offset: const Offset(1, 3),
                      blurRadius: 6,
                      color: context.color.tertiaryColor.withOpacity(0.2),
                    )
                  ]
                : null,
            border: isSelected
                ? null
                : Border.all(color: context.color.borderColor, width: 1.5)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              height: 20.rh(context),
              width: 20.rw(context),
              child: UiUtils.imageType(facility.image!,
                  color: isSelected
                      ? context.color.secondaryColor
                      : (Constant.adaptThemeColorSvg
                          ? context.color.tertiaryColor
                          : null)),
            ),
            Padding(
              padding: const EdgeInsets.all(2.0),
              child: Text(
                facility.name!,
                textAlign: TextAlign.center,
              ).color(isSelected
                  ? context.color.secondaryColor
                  : context.color.tertiaryColor),
            )
          ],
        ),
      ),
    );
  }
}

class OutdoorFacilityDistanceField extends StatelessWidget {
  final TextEditingController controller;

  const OutdoorFacilityDistanceField({
    super.key,
    required this.facility,
    required this.controller,
  });

  final OutdoorFacility facility;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 48.rw(context),
          height: 48.rh(context),
          decoration: BoxDecoration(
            color: context.color.tertiaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: FittedBox(
              fit: BoxFit.none,
              child: SizedBox(
                  height: 24,
                  width: 24,
                  child: UiUtils.imageType(facility.image ?? "",
                      color: context.color.tertiaryColor, fit: BoxFit.cover))),
        ),
        const SizedBox(
          width: 10,
        ),
        Expanded(child: Text(facility.name ?? "")),
        Expanded(
          child: CustomTextFormField(
            keyboard: TextInputType.number,
            validator: CustomTextFieldValidator.nullCheck,
            hintText: "00",
            formaters: [
              FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d*')),
            ],
            controller: controller,
            dense: true,
            suffix: SizedBox(
              width: 5,
              child: Center(
                  child: const Text("KM").color(context.color.textLightColor)),
            ),
          ),
        ),
        const SizedBox(
          width: 10,
        ),
      ],
    );
  }
}

class OutdoorFacilityWithController {
  final OutdoorFacility facility;
  final TextEditingController controller;

  const OutdoorFacilityWithController({
    required this.facility,
    required this.controller,
  });

  @override
  String toString() {
    return 'OutdoorFacilityWithController{' +
        ' facility: $facility,' +
        ' controller: $controller,' +
        '}';
  }

  OutdoorFacilityWithController copyWith({
    OutdoorFacility? facility,
    TextEditingController? controller,
  }) {
    return OutdoorFacilityWithController(
      facility: facility ?? this.facility,
      controller: controller ?? this.controller,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'facility': this.facility,
      'controller': this.controller,
    };
  }

  factory OutdoorFacilityWithController.fromMap(Map<String, dynamic> map) {
    return OutdoorFacilityWithController(
      facility: map['facility'] as OutdoorFacility,
      controller: map['controller'] as TextEditingController,
    );
  }
}

class OutdoorFacilityTable extends StatefulWidget {
  final int length;
  const OutdoorFacilityTable(
      {super.key, required this.child, required this.length});
  final Widget Function(int index) child;
  @override
  State<OutdoorFacilityTable> createState() => _OutdoorFacilityTableState();
}

class _OutdoorFacilityTableState extends State<OutdoorFacilityTable> {
  Size? _oldSize;
  PageController _pageController = PageController();
  int rowCount = 3;
  Map? sizeMap = {};
  int colCount = 3;
  late int totalData = widget.length;
  int itemsPerPage = 9;
  int selectedPage = 0;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          height: (sizeMap?.isEmpty ?? true)
              ? 290
              : (sizeMap?[Key(selectedPage.toString())]?.height ?? 290),
          child: PageView.builder(
            controller: _pageController,
            pageSnapping: true,
            onPageChanged: (value) {
              selectedPage = value;
              setState(() {});
            },
            physics: const BouncingScrollPhysics(),
            itemCount: (totalData / itemsPerPage).ceil(),
            itemBuilder: (context, pageIndex) {
              final startIndex = pageIndex * itemsPerPage;
              final endIndex = (startIndex + itemsPerPage) > totalData
                  ? totalData
                  : (startIndex + itemsPerPage);

              final gridData = List.generate(
                endIndex - startIndex,
                (index) {
                  return 'Data ${(startIndex + index + 1)}';
                },
              );

              Key pageKey = Key(pageIndex.toString());
              return GridView.builder(
                shrinkWrap: true,
                key: pageKey,
                physics: BouncingScrollPhysics(),
                padding: EdgeInsets.symmetric(horizontal: 14),
                gridDelegate:
                    SliverGridDelegateWithFixedCrossAxisCountAndFixedHeight(
                  crossAxisCount: colCount,
                  crossAxisSpacing: 13,
                  mainAxisSpacing: 13,
                  height: 83,
                ),
                itemCount: gridData.length,
                itemBuilder: (BuildContext c, int index) {
                  getGridSize(c, pageIndex, pageKey);
                  final dataIndex = startIndex + index;
                  return widget.child.call(dataIndex);
                },
              );
            },
          ),
        ),
        SizedBox(
          height: 10,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ...List.generate((totalData / itemsPerPage).ceil(), (index) {
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
        )
      ],
    );
  }

  getGridSize(BuildContext context, int pageIndex, Key pageKey) {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      if (!context.mounted) {
        return;
      }
      Size size = ((context as SliverMultiBoxAdaptorElement).renderObject
              as RenderSliverGrid)
          .getAbsoluteSize();

      if (_oldSize != size) {
        if (Key(pageIndex.toString()) == pageKey) {
          sizeMap?[pageKey] = size;
          _oldSize = size;
          setState(() {});
        }
      }
    });
  }
}
