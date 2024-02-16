import 'package:ebroker/exports/main_export.dart';
import 'package:ebroker/utils/Encryption/rsa.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';

import '../../Repositories/system_repository.dart';
import '../../model/system_settings_model.dart';

abstract class FetchSystemSettingsState {}

class FetchSystemSettingsInitial extends FetchSystemSettingsState {}

class FetchSystemSettingsInProgress extends FetchSystemSettingsState {}

class FetchSystemSettingsSuccess extends FetchSystemSettingsState {
  final Map settings;
  FetchSystemSettingsSuccess({
    required this.settings,
  });

  Map<String, dynamic> toMap() {
    return {
      'settings': settings,
    };
  }

  factory FetchSystemSettingsSuccess.fromMap(Map<String, dynamic> map) {
    return FetchSystemSettingsSuccess(
      settings: map['settings'] as Map,
    );
  }
}

class FetchSystemSettingsFailure extends FetchSystemSettingsState {
  final String errorMessage;

  FetchSystemSettingsFailure(this.errorMessage);
}

class FetchSystemSettingsCubit extends Cubit<FetchSystemSettingsState>
    with HydratedMixin {
  FetchSystemSettingsCubit() : super(FetchSystemSettingsInitial());
  final SystemRepository _systemRepository = SystemRepository();
  Future<void> fetchSettings(
      {required bool isAnonymouse, bool? forceRefresh}) async {
    try {
      if (forceRefresh != true) {
        if (state is FetchSystemSettingsSuccess) {
          await Future.delayed(
              const Duration(seconds: AppSettings.hiddenAPIProcessDelay));
        } else {
          emit(FetchSystemSettingsInProgress());
        }
      } else {
        emit(FetchSystemSettingsInProgress());
      }

      if (forceRefresh == true) {
        Map settings = await _systemRepository.fetchSystemSettings(
            isAnonymouse: isAnonymouse);
        Constant.currencySymbol =
            _getSetting(settings, SystemSetting.currencySymball);
        Constant.googlePlaceAPIkey = RSAEncryption().decrypt(
            privateKey: Constant.keysDecryptionPasswordRSA,
            encryptedData: settings['data']['place_api_key']);
        Constant.isAdmobAdsEnabled =
            (settings['data']['show_admob_ads'] == "1");
        Constant.adaptThemeColorSvg = (settings['data']['svg_clr'] == "1");
        Constant.admobBannerAndroid =
            settings['data']?['android_banner_ad_id'] ?? "";
        Constant.admobBannerIos = settings['data']?['ios_banner_ad_id'] ?? "";

        Constant.admobInterstitialAndroid =
            settings['data']?['android_interstitial_ad_id'] ?? "";
        Constant.admobInterstitialIos =
            settings['data']?['ios_interstitial_ad_id'] ?? "";
        emit(FetchSystemSettingsSuccess(settings: settings));
      } else {
        if (state is! FetchSystemSettingsSuccess) {
          Map settings = await _systemRepository.fetchSystemSettings(
              isAnonymouse: isAnonymouse);
          Constant.currencySymbol =
              _getSetting(settings, SystemSetting.currencySymball);
          Constant.googlePlaceAPIkey = RSAEncryption().decrypt(
              privateKey: Constant.keysDecryptionPasswordRSA,
              encryptedData: settings['data']['place_api_key']);
          Constant.isAdmobAdsEnabled =
              (settings['data']['show_admob_ads'] == "1");
          Constant.adaptThemeColorSvg = (settings['data']['svg_clr'] == "1");
          Constant.admobBannerAndroid =
              settings['data']['android_banner_ad_id'];
          Constant.admobBannerIos = settings['data']['ios_banner_ad_id'];

          Constant.admobInterstitialAndroid =
              settings['data']['android_interstitial_ad_id'];
          Constant.admobInterstitialIos =
              settings['data']['ios_interstitial_ad_id'];

          emit(FetchSystemSettingsSuccess(settings: settings));
        } else {
          Constant.googlePlaceAPIkey = RSAEncryption().decrypt(
              privateKey: Constant.keysDecryptionPasswordRSA,
              encryptedData: (state as FetchSystemSettingsSuccess)
                  .settings['data']['place_api_key']);

          Constant.isAdmobAdsEnabled = ((state as FetchSystemSettingsSuccess)
                  .settings['data']['show_admob_ads'] ==
              "1");
          Constant.admobBannerAndroid = (state as FetchSystemSettingsSuccess)
              .settings['data']['android_banner_ad_id'];
          Constant.admobBannerIos = (state as FetchSystemSettingsSuccess)
              .settings['data']['ios_banner_ad_id'];
          Constant.adaptThemeColorSvg = ((state as FetchSystemSettingsSuccess)
                  .settings['data']['svg_clr'] ==
              "1");
          Constant.admobInterstitialAndroid =
              (state as FetchSystemSettingsSuccess).settings['data']
                  ['android_interstitial_ad_id'];
          Constant.admobInterstitialIos = (state as FetchSystemSettingsSuccess)
              .settings['data']['ios_interstitial_ad_id'];

          emit(FetchSystemSettingsSuccess(
              settings: (state as FetchSystemSettingsSuccess).settings));
        }
      }
    } catch (e) {
      emit(FetchSystemSettingsFailure(e.toString()));
    }
  }

  dynamic getSetting(SystemSetting selected) {
    if (state is FetchSystemSettingsSuccess) {
      Map settings = (state as FetchSystemSettingsSuccess).settings['data'];
      if (selected == SystemSetting.subscription) {
        //check if we have subscribed to any package if true then return this data otherwise return empty list
        if (settings['subscription'] == true) {
          return settings['package']['user_purchased_package'] as List;
        } else {
          return [];
        }
      }

      if (selected == SystemSetting.language) {
        return settings['languages'];
      }

      if (selected == SystemSetting.demoMode) {
        if (settings.containsKey("demo_mode")) {
          return settings['demo_mode'];
        } else {
          return false;
        }
      }

      /// where selected is equals to type
      var selectedSettingData =
          (settings[Constant.systemSettingKeys[selected]]);

      return selectedSettingData;
    }
  }

  Map getRawSettings() {
    if (state is FetchSystemSettingsSuccess) {
      return (state as FetchSystemSettingsSuccess).settings['data'];
    }
    return {};
  }

  dynamic _getSetting(Map settings, SystemSetting selected) {
    var selectedSettingData =
        settings['data'][Constant.systemSettingKeys[selected]];

    return selectedSettingData;
  }

  @override
  FetchSystemSettingsState? fromJson(Map<String, dynamic> json) {
    try {
      if (json['cubit_state'] == "FetchSystemSettingsSuccess") {
        FetchSystemSettingsSuccess fetchSystemSettingsSuccess =
            FetchSystemSettingsSuccess.fromMap(json);

        return fetchSystemSettingsSuccess;
      }
    } catch (e, st) {}
    return null;
  }

  @override
  Map<String, dynamic>? toJson(FetchSystemSettingsState state) {
    try {
      if (state is FetchSystemSettingsSuccess) {
        Map<String, dynamic> mapped = state.toMap();
        mapped['cubit_state'] = "FetchSystemSettingsSuccess";
        return mapped;
      }
    } catch (e) {}

    return null;
  }
}
