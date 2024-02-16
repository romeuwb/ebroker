import 'package:flutter_bloc/flutter_bloc.dart';

import '../../Repositories/advertisement_repository.dart';
import '../../model/subscription_package_limit.dart';

abstract class GetSubsctiptionPackageLimitsState {}

class GetSubsctiptionPackageLimitsInitial
    extends GetSubsctiptionPackageLimitsState {}

class GetSubsctiptionPackageLimitsInProgress
    extends GetSubsctiptionPackageLimitsState {}

class GetSubsctiptionPackageLimitsSuccess
    extends GetSubsctiptionPackageLimitsState {
  final SubcriptionPackageLimit packageLimit;

  GetSubsctiptionPackageLimitsSuccess(this.packageLimit);
}

class GetSubsctiptionPackageLimitsFailure
    extends GetSubsctiptionPackageLimitsState {
  final String errorMessage;
  GetSubsctiptionPackageLimitsFailure(this.errorMessage);
}

class GetSubsctiptionPackageLimitsCubit
    extends Cubit<GetSubsctiptionPackageLimitsState> {
  final AdvertisementRepository _advertisementRepository =
      AdvertisementRepository();

  GetSubsctiptionPackageLimitsCubit()
      : super(GetSubsctiptionPackageLimitsInitial());

  Future<void> getLimits(String packageId) async {
    try {
      emit(GetSubsctiptionPackageLimitsInProgress());
      SubcriptionPackageLimit subscriptionPackageLimit =
          await _advertisementRepository.getPackageLimit(packageId);
      emit(GetSubsctiptionPackageLimitsSuccess(subscriptionPackageLimit));
    } catch (error) {
      emit(GetSubsctiptionPackageLimitsFailure(error.toString()));
    }
  }

//this will increase our advertisement use count
  void increaseAdvertismentUseCount() {
    if (state is GetSubsctiptionPackageLimitsSuccess) {
      SubcriptionPackageLimit packageLimits =
          (state as GetSubsctiptionPackageLimitsSuccess).packageLimit;

      int increaseCount = packageLimits.usedLimitOfAdvertisement + 1;

      SubcriptionPackageLimit updatedPackageLimit =
          packageLimits.copyWith(usedLimitOfAdvertisement: increaseCount);
      emit(GetSubsctiptionPackageLimitsSuccess(updatedPackageLimit));
    }
  }

  void increaseProeprtyUseCount() {
    if (state is GetSubsctiptionPackageLimitsSuccess) {
      SubcriptionPackageLimit packageLimits =
          (state as GetSubsctiptionPackageLimitsSuccess).packageLimit;

      int increaseCount = packageLimits.usedLimitOfProperty + 1;

      SubcriptionPackageLimit updatedPackageLimit =
          packageLimits.copyWith(usedLimitOfProperty: increaseCount);
      emit(GetSubsctiptionPackageLimitsSuccess(updatedPackageLimit));
    }
  }
}
