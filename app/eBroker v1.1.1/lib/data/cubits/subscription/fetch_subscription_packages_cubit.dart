// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:ebroker/data/Repositories/subscription_repository.dart';
import 'package:ebroker/data/model/data_output.dart';
import 'package:ebroker/data/model/subscription_pacakage_model.dart';

abstract class FetchSubscriptionPackagesState {}

class FetchSubscriptionPackagesInitial extends FetchSubscriptionPackagesState {}

class FetchSubscriptionPackagesInProgress
    extends FetchSubscriptionPackagesState {}

class FetchSubscriptionPackagesSuccess extends FetchSubscriptionPackagesState {
  final List<SubscriptionPackageModel> subscriptionPacakges;
  FetchSubscriptionPackagesSuccess({
    required this.subscriptionPacakges,
  });
}

class FetchSubscriptionPackagesFailure extends FetchSubscriptionPackagesState {
  final dynamic errorMessage;

  FetchSubscriptionPackagesFailure(this.errorMessage);
}

class FetchSubscriptionPackagesCubit
    extends Cubit<FetchSubscriptionPackagesState> {
  FetchSubscriptionPackagesCubit() : super(FetchSubscriptionPackagesInitial());
  final SubscriptionRepository _subscriptionRepository =
      SubscriptionRepository();
  Future<void> fetchPackages() async {
    try {
      emit(FetchSubscriptionPackagesInProgress());
      DataOutput<SubscriptionPackageModel> result =
          await _subscriptionRepository.getSubscriptionPacakges();
      emit(FetchSubscriptionPackagesSuccess(
          subscriptionPacakges: result.modelList));
    } catch (e) {
      emit(FetchSubscriptionPackagesFailure(e));
    }
  }
}
