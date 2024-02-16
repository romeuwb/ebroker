import 'dart:io';

import 'package:dio/dio.dart';

import '../../utils/api.dart';
import '../model/subscription_package_limit.dart';

class AdvertisementRepository {
  Future<Map<String, dynamic>> create({
    required String type,
    required String propertyId,
    required String packageId,
    File? image,
  }) async {
    Map<String, dynamic> parameters = {
      Api.packageId: packageId,
      Api.propertyId: propertyId,
      Api.type: type
    };
    if (image != null) {
      parameters[Api.image] = await MultipartFile.fromFile(image.path);
    }

    return await Api.post(url: Api.storeAdvertisement, parameter: parameters);
  }

  Future<SubcriptionPackageLimit> getPackageLimit(String packageId) async {
    Map<String, dynamic> response =
        await Api.get(url: Api.getLimitsOfPackage, queryParameters: {
      "id": packageId,
    });
    return SubcriptionPackageLimit.fromMap(response);
  }

  Future deleteAdvertisment(dynamic id) async {
    await Api.post(url: Api.deleteAdvertisement, parameter: {Api.id: id});
  }
}
