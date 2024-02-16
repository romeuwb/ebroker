// ignore_for_file: depend_on_referenced_packages

import 'dart:collection';
import 'dart:io';

import 'package:collection/collection.dart';
import 'package:dio/dio.dart';
import 'package:ebroker/Ui/screens/proprties/AddProperyScreens/property_success.dart';
import 'package:ebroker/app/routes.dart';
import 'package:ebroker/data/cubits/Utility/proeprty_edit_global.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http_parser/http_parser.dart' as h;
import 'package:mime/mime.dart';

import '../../../../data/cubits/property/create_property_cubit.dart';
import '../../../../data/cubits/property/fetch_my_properties_cubit.dart';
import '../../../../data/helper/widgets.dart';
import '../../../../utils/Extensions/extensions.dart';
import '../../../../utils/constant.dart';
import '../../../../utils/helper_utils.dart';
import '../../../../utils/responsiveSize.dart';
import '../../../../utils/ui_utils.dart';
import '../../widgets/AnimatedRoutes/blur_page_route.dart';
import '../../widgets/AnimatedRoutes/scale_up_route.dart';
import '../../widgets/DynamicField/dynamic_field.dart';
import '../Property tab/sell_rent_screen.dart';

class SetProeprtyParametersScreen extends StatefulWidget {
  final Map propertyDetails;
  final bool isUpdate;
  const SetProeprtyParametersScreen(
      {super.key, required this.propertyDetails, required this.isUpdate});
  static Route route(RouteSettings settings) {
    Map? argument = settings.arguments as Map?;

    return BlurredRouter(
      builder: (context) {
        return SetProeprtyParametersScreen(
          propertyDetails: argument?['details'],
          isUpdate: argument?['isUpdate'],
        );
      },
    );
  }

  @override
  State<SetProeprtyParametersScreen> createState() =>
      _SetProeprtyParametersScreenState();
}

class _SetProeprtyParametersScreenState
    extends State<SetProeprtyParametersScreen>
    with AutomaticKeepAliveClientMixin {
  List<ValueNotifier> disposableFields = [];
  final GlobalKey<FormState> _formKey = GlobalKey();
  List galleryImage = [];
  File? titleImage;
  File? t360degImage;
  File? meta_image;
  Map<String, dynamic>? apiParameters;
  var paramaeterUI = [];
  @override
  void initState() {
    apiParameters = Map.from(widget.propertyDetails);
    galleryImage = apiParameters!['gallery_images'];
    titleImage = apiParameters!['title_image'];
    t360degImage = apiParameters!['threeD_image'];
    meta_image = apiParameters!['meta_image'];
    Future.delayed(
      Duration.zero,
      () {
        paramaeterUI = (Constant
                .addProperty['category']?.parameterTypes!['parameters'] as List)
            .mapIndexed((index, parameter) => Padding(
                  padding:
                      EdgeInsets.only(top: index == 0 ? 0 : 10, bottom: 10),
                  child: buildDynamicField(parameter, index),
                ))
            .toList()
            .cast();
        setState(() {});
      },
    );
    super.initState();
  }

  Widget buildDynamicField(Map parameter, int index) {
    ///Initital Container to assign
    Widget dynamicField = Container();

    ///This is factory class it will check type and it will return field class accordingly
    AbstractField field =
        FieldFactory.getField(context, parameter['type_of_parameter']);
    // if (widget.isUpdate) {
    //   AbstractField.fieldsData.addAll(
    //     {
    //       "parameters[$index][parameter_id]": parameter['id'],
    //       "parameters[$index][value]": parameter['value']
    //     },
    //   );
    // }

    ///Same like Bloc State management we check if field is AbstractDropdown, So we can apply additional configuration or add data to it
    if (field is AbstractDropdown) {
      var selected = parameter['value'];
      if (selected == "") {
        selected = (parameter['type_values'] as List).first;
      }
      dynamicField = field
          .setItems(parameter['type_values'])
          .setSelectedItem(selected)
          .createField(
            parameter,
          );
    } else if (field is AbstractTextField) {
      dynamicField = field.createField(parameter);
    } else if (field is AbstractNumberField) {
      dynamicField = field.createField(parameter);
    } else if (field is AbstractRadioButton) {
      dynamicField =
          field.setValues(parameter['type_values']).createField(parameter);
    } else if (field is AbstractTextAreaField) {
      dynamicField = field.createField(parameter);
    } else if (field is AbstractCheckBoxButton) {
      dynamicField = field
          .setCheckBoxValues(parameter['type_values'])
          .createField(parameter);
      // disposableFields.add(field.checked);
    } else if (field is AbstractPickFileButton) {
      dynamicField = field.createField(parameter);
      // field.filePicked.value
    }

    ///Returning field
    return dynamicField;
  }

  ///This will convert {0:Demo} to it's required format here we have assigned Parameter id : value, before.
  Map<String, dynamic> assembleDynamicFieldsParameters() {
    Map<String, dynamic> parameters = {};

    Map fieldsData = AbstractField.fieldsData;
    for (var i = 0; i < fieldsData.entries.length; i++) {
      MapEntry element = fieldsData.entries.elementAt(i);
      var value = element.value;
      if (value is LinkedHashMap) {
        value = (value).toString();
      }
      if (value == null) {
        continue;
      }
      parameters.addAll({
        "parameters[$i][parameter_id]": element.key,
        "parameters[$i][value]": value
      });
    }
    return parameters;
  }

  List<Widget> buildFields() {
    if (Constant.addProperty['category'] == null) {
      return [Container()];
    }

    ///Loop parameters
    return paramaeterUI.cast();
  }

  void disposeDynamicFieldsValueControllers() {
    for (var element in disposableFields) {
      element.dispose();
    }
  }

  @override
  void dispose() {
    disposeDynamicFieldsValueControllers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      backgroundColor: context.color.backgroundColor,
      appBar: UiUtils.buildAppBar(
        context,
        showBackButton: true,
        actions: const [
          Text("3/4"),
          SizedBox(
            width: 14,
          ),
        ],
        title: widget.isUpdate
            ? UiUtils.getTranslatedLabel(context, "updateProperty")
            : UiUtils.getTranslatedLabel(context, "ddPropertyLbl"),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 7),
        child: UiUtils.buildButton(
          context,
          height: 48.rh(context),
          onPressed: () async {
            // if (_formKey.currentState!.validate() == false) return;

            //TODO: TODO
            apiParameters!.addAll(assembleDynamicFieldsParameters());

            /// Multipartimage of gallery images
            List gallery = [];
            await Future.forEach(
              galleryImage,
              (dynamic item) async {
                var multipartFile = await MultipartFile.fromFile(item.path);
                if (!multipartFile.isFinalized) {
                  gallery.add(multipartFile);
                }
              },
            );
            apiParameters!['gallery_images'] = gallery;

            if (titleImage != null) {
              ///Multipart image of title image
              final mimeType = lookupMimeType((titleImage as File).path);
              var extension = mimeType!.split("/");
              apiParameters!['title_image'] = await MultipartFile.fromFile(
                  (titleImage as File).path,
                  contentType: h.MediaType('image', extension[1]),
                  filename: (titleImage as File).path.split("/").last);
            }

            //set 360 deg image

            if (t360degImage != null) {
              final mimeType = lookupMimeType(t360degImage!.path);
              var extension = mimeType!.split("/");

              apiParameters!['threeD_image'] = await MultipartFile.fromFile(
                  t360degImage?.path ?? "",
                  contentType: h.MediaType('image', extension[1]),
                  filename: t360degImage?.path.split("/").last);
            }

            if (meta_image != null) {
              final mimeType = lookupMimeType(meta_image!.path);
              List<String> extension = mimeType!.split("/");
              apiParameters!['meta_image'] = await MultipartFile.fromFile(
                  meta_image?.path ?? "",
                  contentType: h.MediaType('image', extension[1]),
                  filename: meta_image?.path.split("/").last);
            }

            Future.delayed(
              Duration.zero,
              () {
                // / if (Constant.isDemoModeOn) {
                // /   HelperUtils.showSnackBarMessage(
                // /       context,
                // UiUtils.getTranslatedLabel(
                // context, "thisActionNotValidDemo"));
                //   return;
                // }

                // Navigator.push(context, MaterialPageRoute(builder: (context) {
                //   return SelectOutdoorFacility();
                // },));
                apiParameters?['isUpdate'] = widget.isUpdate;
                Navigator.pushNamed(context, Routes.selectOutdoorFacility,
                    arguments: apiParameters);

                // context
                //     .read<CreatePropertyCubit>()
                //     .create(parameters: apiParameters!);
              },
            );
          },
          buttonTitle: UiUtils.getTranslatedLabel(context, "next"),
        ),
      ),
      body: Form(
        key: _formKey,
        child: BlocListener<CreatePropertyCubit, CreatePropertyState>(
          listener: (context, state) {
            if (state is CreatePropertyInProgress) {
              Widgets.showLoader(context);
            }

            if (state is CreatePropertyFailure) {
              Widgets.hideLoder(context);
              HelperUtils.showSnackBarMessage(context, state.errorMessage);
            }
            if (state is CreatePropertySuccess) {
              Widgets.hideLoder(context);
              if (widget.isUpdate == false) {
                ref[propertyType ?? "sell"]
                    ?.fetchMyProperties(type: propertyType ?? "sell");
                Future.delayed(
                  const Duration(milliseconds: 260),
                  () {
                    Navigator.pushReplacement(
                        context,
                        ScaleUpRouter(
                          builder: (context) {
                            return PropertyAddSuccess(
                              model: state.propertyModel!,
                            );
                          },
                          current: widget,
                        ));
                  },
                );
              } else {
                context.read<PropertyEditCubit>().add(state.propertyModel!);
                context
                    .read<FetchMyPropertiesCubit>()
                    .update(state.propertyModel!);
                cubitReference?.update(state.propertyModel!);
                HelperUtils.showSnackBarMessage(context,
                    UiUtils.getTranslatedLabel(context, "propertyUpdated"),
                    type: MessageType.success, onClose: () {
                  Navigator.of(context)
                    ..pop()
                    ..pop()
                    ..pop()
                    ..pop();
                });
              }
            }
          },
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(UiUtils.getTranslatedLabel(context, "addvalues")),
                  SizedBox(
                    height: 18,
                  ),
                  ...buildFields(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  // TODO: implement wantKeepAlive
  bool get wantKeepAlive => true;
}
