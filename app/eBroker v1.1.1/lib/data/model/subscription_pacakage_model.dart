// ignore_for_file: public_member_api_docs, sort_constructors_first

import 'package:ebroker/utils/Extensions/lib/adaptive_type.dart';

class SubscriptionPackageModel {
  int? id;
  String? name;
  int? duration;
  num? price;
  int? status;
  dynamic propertyLimit;
  dynamic advertisementlimit;
  String? createdAt;
  String? updatedAt;

  SubscriptionPackageModel(
      {this.id,
      this.name,
      this.duration,
      this.price,
      this.status,
      this.propertyLimit,
      this.advertisementlimit,
      this.createdAt,
      this.updatedAt});

  SubscriptionPackageModel.fromJson(Map<String, dynamic> json) {
    propertyLimit = json['property_limit'];
    advertisementlimit = json['advertisement_limit'];
    id = json['id'];
    name = json['name'];
    duration = json['duration'];
    price = json['price'];
    status = Adapter.forceInt(json['status']);
    createdAt = json['created_at'];
    updatedAt = json['updated_at'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['duration'] = duration;
    data['price'] = price;
    data['status'] = status;
    data['created_at'] = createdAt;
    data['updated_at'] = updatedAt;

    data['property_limit'] = propertyLimit;
    data['advertisement_limit'] = advertisementlimit;
    return data;
  }

  @override
  String toString() {
    return 'SubscriptionPackageModel(id: $id, name: $name, duration: $duration, price: $price, status: $status, propertyLimit: $propertyLimit, advertisementlimit: $advertisementlimit, createdAt: $createdAt, updatedAt: $updatedAt)';
  }
}
