import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../data/cubits/property/fetch_most_viewed_properties_cubit.dart';
import '../../../data/model/property_model.dart';
import '../../../utils/Extensions/extensions.dart';
import '../../../utils/helper_utils.dart';
import '../../../utils/ui_utils.dart';
import '../widgets/AnimatedRoutes/blur_page_route.dart';
import '../widgets/Erros/no_data_found.dart';
import '../widgets/Erros/something_went_wrong.dart';
import 'Widgets/property_horizontal_card.dart';

class MostViewedPropertiesScreen extends StatefulWidget {
  const MostViewedPropertiesScreen({super.key});

  static Route route(RouteSettings routeSettings) {
    return BlurredRouter(
      builder: (context) {
        return const MostViewedPropertiesScreen();
      },
    );
  }

  @override
  State<MostViewedPropertiesScreen> createState() =>
      _MostViewedPropertiesScreenState();
}

class _MostViewedPropertiesScreenState
    extends State<MostViewedPropertiesScreen> {
  ///This Scroll controller for listen page end
  final ScrollController _pageScollController = ScrollController();
  @override
  void initState() {
    _pageScollController.addListener(onPageEnd);
    super.initState();
  }

  ///This method will listen page scroll changes
  void onPageEnd() {
    ///This is exetension which will check if we reached end or not
    if (_pageScollController.isEndReached()) {
      if (context.read<FetchMostViewedPropertiesCubit>().hasMoreData()) {
        context.read<FetchMostViewedPropertiesCubit>().fetchMore();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.color.primaryColor,
      appBar: AppBar(
        backgroundColor: context.color.secondaryColor,
        elevation: 0,
        iconTheme: IconThemeData(color: context.color.tertiaryColor),
        title: Text(UiUtils.getTranslatedLabel(context, "mostViewed"))
            .color(context.color.tertiaryColor)
            .size(context.font.large),
      ),
      body: BlocBuilder<FetchMostViewedPropertiesCubit,
          FetchMostViewedPropertiesState>(
        builder: (context, state) {
          if (state is FetchMostViewedPropertiesInProgress) {
            return Center(
              child: UiUtils.progress(
                  normalProgressColor: context.color.tertiaryColor),
            );
          }
          if (state is FetchMostViewedPropertiesFailure) {
            return const SomethingWentWrong();
          }
          if (state is FetchMostViewedPropertiesSuccess) {
            if (state.properties.isEmpty) {
              return Center(
                child: NoDataFound(
                  onTap: () {
                    context.read<FetchMostViewedPropertiesCubit>().fetch();
                  },
                ),
              );
            }
            return Column(
              children: [
                Expanded(
                  child: ScrollConfiguration(
                    behavior: RemoveGlow(),
                    child: ListView.builder(
                      controller: _pageScollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: state.properties.length,
                      itemBuilder: (context, index) {
                        PropertyModel property = state.properties[index];
                        return GestureDetector(
                            onTap: () {
                              HelperUtils.goToNextPage(
                                  Routes.propertyDetails, context, false,
                                  args: {
                                    'propertyData': property,
                                    'propertiesList': state.properties,
                                    'fromMyProperty': false,
                                  });
                            },
                            child: PropertyHorizontalCard(
                              property: property,
                            ));
                      },
                    ),
                  ),
                ),
                if (state.isLoadingMore) UiUtils.progress()
              ],
            );
          }
          return Container();
        },
      ),
    );
  }
}
