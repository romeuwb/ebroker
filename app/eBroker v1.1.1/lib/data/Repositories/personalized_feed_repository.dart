import 'package:ebroker/data/model/Personalized/personalized_settings.dart';
import 'package:ebroker/utils/Extensions/lib/map.dart';
import 'package:ebroker/utils/api.dart';
import 'package:flutter/material.dart';

import '../../app/app.dart';
import '../../utils/constant.dart';
import '../model/data_output.dart';
import '../model/property_model.dart';

enum PersonalizedFeedAction { add, edit, get }

class PersonalizedFeedRepository {
  Future<void> addOrUpdate({
    required PersonalizedFeedAction action,
    required List<int> categoryIds,
    List<int>? outdoorFacilityList,
    RangeValues? priceRange,
    List<int>? selectedPropertyType,
    String? city,
  }) async {
    ////List to String
    String categoryStringArray = categoryIds.join(",");
    String outdoorFacilityStringArray = outdoorFacilityList?.join(",") ?? "";
    String priceRangeString = "${priceRange?.start},${priceRange?.end}";
    String propertyTypeString = selectedPropertyType?.join(",") ?? "";

    Map<String, dynamic> parameters = {
      "action": action.name,
      "category_ids": categoryStringArray,
      "outdoor_facilitiy_ids": outdoorFacilityStringArray,
      "price_range": priceRangeString,
      "property_type": propertyTypeString,
      "city": city?.toLowerCase()
    };
    parameters.removeEmptyKeys();
    Map<String, dynamic> result =
        await Api.post(url: Api.addEditUserInterest, parameter: parameters);

    try {
      personalizedInterestSettings =
          PersonalizedInterestSettings.fromMap(result['data']);
    } catch (e) {}
  }

  Future<PersonalizedInterestSettings> getUserPersonalizedSettings() async {
    try {
      Map<String, dynamic> userPersonalization = await Api.post(
        parameter: {
          "action": "get",
        },
        url: Api.addEditUserInterest,
      );
      return PersonalizedInterestSettings.fromMap(
        userPersonalization['data'],
      );
    } catch (e) {
      return PersonalizedInterestSettings.empty();
    }
  }

  Future<DataOutput<PropertyModel>> getPersonalizedProeprties({
    required int offset,
  }) async {
    Map<String, dynamic> response = await Api.get(
      url: Api.getUserRecommendation,
      queryParameters: {
        Api.offset: offset,
        Api.limit: Constant.loadLimit,
      },
    );

    List<PropertyModel> modelList = (response['data'] as List)
        .map((e) => PropertyModel.fromMap(e))
        .toList();
    return DataOutput(total: response['total'] ?? 0, modelList: modelList);
  }
}
