import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../data/Repositories/location_repository.dart';
import '../../../../data/cubits/Utility/google_place_autocomplate_cubit.dart';
import '../../../../data/model/google_place_model.dart';
import '../../../../utils/Extensions/extensions.dart';
import '../../../../utils/ui_utils.dart';

///This will show when you will need to fill your location,
///
class ChooseLocatonBottomSheet extends StatefulWidget {
  const ChooseLocatonBottomSheet({Key? key}) : super(key: key);

  @override
  State<ChooseLocatonBottomSheet> createState() =>
      ChooseLocatonBottomSheetState();
}

class ChooseLocatonBottomSheetState extends State<ChooseLocatonBottomSheet> {
  final TextEditingController _searchLocation = TextEditingController();
  Timer? delayTimer;
  dynamic cubitReferance;
  int previouseLength = 0;

  @override
  void initState() {
    super.initState();

    ///This will create listener which will listen to out text change in text field
    _searchLocation.addListener(() {
      ///If there is no text in text field so we don't need to call an API.
      ///Therefor we are cancel this timer
      ///
      if (_searchLocation.text.isEmpty) {
        delayTimer?.cancel();
      }

      ///If our timer is already active so we will cancel it,
      /*For eg, API will call after 500 miliseconds when we write text in TextField and
       we wait, If we try to write in that field again so timer is already active and it is
        on 300 miliseconds , Now we have not completed our writing and API will call on 500 miliseconds
         , To prevent this we cancel timer when we write again in that field
     */
      if (delayTimer?.isActive ?? false) delayTimer?.cancel();

      ///Create new timer after cancel previous one
      delayTimer = Timer(const Duration(milliseconds: 500), () {
        ///Search only if text field is not empty otherwise it will call when we tap on search field,
        if (_searchLocation.text.isNotEmpty) {
          ///Only call when our text doesn't match with our previous text,
          ///When we search `Hello` then it will call API and search city named hello, when we write again hello so it will call again, So why do we need to call it when we have it's data already available?
          if (_searchLocation.text.length != previouseLength) {
            context
                .read<GooglePlaceAutocompleteCubit>()
                .getLocationFromText(text: _searchLocation.text);

            ///set previous text length
            previouseLength = _searchLocation.text.length;
          }
        }
      });
    });
  }

  @override
  void dispose() {
    _searchLocation.dispose();
    delayTimer?.cancel();
    cubitReferance.clearCubit();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    cubitReferance = context.read<GooglePlaceAutocompleteCubit>();
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.7,
      child: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              UiUtils.getTranslatedLabel(
                context,
                "selectLocation",
              ),
              style: TextStyle(fontSize: context.font.larger),
            ),
            const SizedBox(height: 20),
            TextField(
                controller: _searchLocation,
                onChanged: (e) {},
                cursorColor: context.color.tertiaryColor,
                decoration: InputDecoration(
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: context.color.tertiaryColor)),
                    fillColor: context.color.tertiaryColor.withOpacity(0.01),
                    filled: true,
                    prefixIcon: Icon(
                      Icons.search,
                      color: context.color.tertiaryColor,
                    ),
                    hintText:
                        UiUtils.getTranslatedLabel(context, "enterLocation"),
                    border: const OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(11))))),
            BlocBuilder<GooglePlaceAutocompleteCubit,
                GooglePlaceAutocompleteState>(
              builder:
                  (context, GooglePlaceAutocompleteState googlePlaceState) {
                if (googlePlaceState is GooglePlaceAutocompleteSuccess) {
                  if (googlePlaceState.autocompleteResult.isNotEmpty) {
                    return ListView.builder(
                        itemCount: googlePlaceState.autocompleteResult.length,
                        shrinkWrap: true,
                        itemBuilder: (context, int i) {
                          return ListTile(
                            onTap: () async {
                              ///This will fetch place details from given PlaceId
                              var cordinates = await GooglePlaceRepository()
                                  .getPlaceDetailsFromPlaceId(googlePlaceState
                                      .autocompleteResult[i].placeId);

                              GooglePlaceModel placeModel =
                                  googlePlaceState.autocompleteResult[i];

                              ///Now we have place Model
                              placeModel = placeModel.copyWith(
                                  latitude: cordinates['lat'].toString(),
                                  longitude: cordinates['lng'].toString());

                              Future.delayed(
                                Duration.zero,
                                () {
                                  WidgetsBinding.instance
                                      .addPostFrameCallback((timeStamp) {
                                    Navigator.pop(
                                      context,
                                      placeModel,
                                    );
                                  });
                                },
                              );
                            },
                            leading: const Icon(Icons.location_city),
                            title: Text(googlePlaceState
                                .autocompleteResult[i].description
                                .toString()),
                          );
                        });
                  }
                  return Padding(
                    padding: const EdgeInsetsDirectional.only(top: 8.0),
                    child: Center(
                        child: Text(UiUtils.getTranslatedLabel(
                            context, 'nodatafound'))),
                  );
                }

                ///Show progress when loading
                if (googlePlaceState is GooglePlaceAutocompleteInProgress) {
                  return Padding(
                    padding: const EdgeInsetsDirectional.only(top: 8.0),
                    child: Center(
                      child: UiUtils.progress(
                          normalProgressColor: context.color.tertiaryColor),
                    ),
                  );
                }
                return Container();
              },
            )
          ],
        ),
      ),
    );
  }
}
