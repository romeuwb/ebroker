// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:ebroker/utils/constant.dart';

import '../../../Repositories/property_repository.dart';

enum PropertyInterest {
  interested("1"),
  notInterested("0");

  final String value;
  const PropertyInterest(this.value);
}

abstract class ChangeInterestInPropertyState {}

class ChangeInterestInPropertyInitial extends ChangeInterestInPropertyState {}

class ChangeInterestInPropertyInProgress
    extends ChangeInterestInPropertyState {}

class ChangeInterestInPropertySuccess extends ChangeInterestInPropertyState {
  PropertyInterest interest;
  ChangeInterestInPropertySuccess({
    required this.interest,
  });
}

class ChangeInterestInPropertyFailure extends ChangeInterestInPropertyState {
  final String errorMessage;

  ChangeInterestInPropertyFailure(this.errorMessage);
}

class ChangeInterestInPropertyCubit
    extends Cubit<ChangeInterestInPropertyState> {
  final PropertyRepository _propertyRepository = PropertyRepository();

  ChangeInterestInPropertyCubit() : super(ChangeInterestInPropertyInitial());

  Future<void> changeInterest({
    required String propertyId,
    required PropertyInterest interest,
  }) async {
    try {
      emit(ChangeInterestInPropertyInProgress());
      await _propertyRepository.setInterest(
          interest: interest.value, propertyId: propertyId);
      if (interest == PropertyInterest.interested) {
        Constant.interestedPropertyIds.add(int.parse(propertyId));
      } else {
        Constant.interestedPropertyIds.remove(int.parse(propertyId));
      }

      emit(ChangeInterestInPropertySuccess(interest: interest));
    } catch (e) {
      emit(ChangeInterestInPropertyFailure(e.toString()));
    }
  }
}
