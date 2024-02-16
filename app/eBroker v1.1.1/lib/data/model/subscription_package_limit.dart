// ignore_for_file: public_member_api_docs, sort_constructors_first
// To parse this JSON data, do
//
//     final subcriptionPackageLimit = subcriptionPackageLimitFromMap(jsonString);

import 'dart:convert';

class SubcriptionPackageLimit {
  SubcriptionPackageLimit({
    required this.totalLimitOfAdvertisement,
    required this.totalLimitOfProperty,
    required this.usedLimitOfAdvertisement,
    required this.usedLimitOfProperty,
  });

  final dynamic totalLimitOfAdvertisement;
  final dynamic totalLimitOfProperty;
  final dynamic usedLimitOfAdvertisement;
  final dynamic usedLimitOfProperty;

  SubcriptionPackageLimit copyWith({
    dynamic totalLimitOfAdvertisement,
    dynamic totalLimitOfProperty,
    dynamic usedLimitOfAdvertisement,
    dynamic usedLimitOfProperty,
  }) {
    return SubcriptionPackageLimit(
      totalLimitOfAdvertisement:
          totalLimitOfAdvertisement ?? this.totalLimitOfAdvertisement,
      totalLimitOfProperty: totalLimitOfProperty ?? this.totalLimitOfProperty,
      usedLimitOfAdvertisement:
          usedLimitOfAdvertisement ?? this.usedLimitOfAdvertisement,
      usedLimitOfProperty: usedLimitOfProperty ?? this.usedLimitOfProperty,
    );
  }

  factory SubcriptionPackageLimit.fromJson(String str) =>
      SubcriptionPackageLimit.fromMap(json.decode(str));

  String toJson() => json.encode(toMap());

  factory SubcriptionPackageLimit.fromMap(Map<String, dynamic> json) =>
      SubcriptionPackageLimit(
        totalLimitOfAdvertisement: json["total_limit_of_advertisement"],
        totalLimitOfProperty: json["total_limit_of_property"],
        usedLimitOfAdvertisement: json["used_limit_of_advertisement"],
        usedLimitOfProperty: json["used_limit_of_property"],
      );

  Map<String, dynamic> toMap() => {
        "total_limit_of_advertisement": totalLimitOfAdvertisement,
        "total_limit_of_property": totalLimitOfProperty,
        "used_limit_of_advertisement": usedLimitOfAdvertisement,
        "used_limit_of_property": usedLimitOfProperty,
      };

  @override
  String toString() {
    return 'SubcriptionPackageLimit(totalLimitOfAdvertisement: $totalLimitOfAdvertisement, totalLimitOfProperty: $totalLimitOfProperty, usedLimitOfAdvertisement: $usedLimitOfAdvertisement, usedLimitOfProperty: $usedLimitOfProperty)';
  }
}
