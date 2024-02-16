import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../utils/api.dart';
import '../../../utils/hive_utils.dart';
import '../../helper/custom_exception.dart';

abstract class DeleteAccountState {}

class DeleteAccountInitial extends DeleteAccountState {}

class DeleteAccountProgress extends DeleteAccountState {}

class DeleteAccountFailure extends DeleteAccountState {
  final String errorMessage;
  DeleteAccountFailure(this.errorMessage);
}

class AccountDeleted extends DeleteAccountState {
  final String successMessage;
  AccountDeleted({required this.successMessage});
}

class DeleteAccountCubit extends Cubit<DeleteAccountState> {
  DeleteAccountCubit() : super(DeleteAccountInitial());
  void deleteUserAccount(BuildContext context) {
    emit(DeleteAccountProgress());
    deleteAccount(context)
        .then((value) => emit(AccountDeleted(successMessage: value)))
        .catchError((e) => emit(DeleteAccountFailure(e.toString())));
  }

  Future<String> deleteAccount(BuildContext context) async {
    String message = '';
    try {
      /* User? currentUser = await FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        await currentUser.reload();
      }*/
      await FirebaseAuth.instance.currentUser!.delete().then((value) async {
        Map<String, String> parameter = {Api.userid: HiveUtils.getUserId()!};

        var response =
            await Api.post(url: Api.apiDeleteUser, parameter: parameter);
        User? user = FirebaseAuth.instance.currentUser;
        await user?.delete();
        if (response["error"]) {
          throw CustomException(response["message"]);
        } else {
          Future.delayed(
            Duration.zero,
            () {
              HiveUtils.logoutUser(context, onLogout: () {}, isRedirect: false);
            },
          );
          message = response['message'];
        }
      });
    } on FirebaseAuthException catch (e) {
      if (e.code == 'requires-recent-login') {
        // throw CustomException(Strings.userDeleteErrorMessage);
      }
    }
    return message;
  }
}
