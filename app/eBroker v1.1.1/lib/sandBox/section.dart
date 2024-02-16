import 'package:ebroker/utils/Extensions/extensions.dart';
import 'package:flutter/material.dart';

import '../Ui/screens/proprties/viewAll.dart';

enum SectionStyle { BigCard, HorizontalCard, GradientCard, Grid }

abstract class Section<T> {
  late BuildContext context;
  abstract T s;
  abstract bool seeAll;
  String get sectionTitle;
  abstract StateMap stateMap;
  abstract SectionStyle style;

  Widget render();
}

class FeaturedSection extends Section<int> {
  @override
  Widget render() {
    return Container();
  }

  @override
  String get sectionTitle => "h".translate(context);

  @override
  bool seeAll = true;

  @override
  StateMap stateMap = StateMap();

  @override
  SectionStyle style = SectionStyle.BigCard;

  @override
  int s = 4;
}

class RenderSection extends StatefulWidget {
  final Section section;
  const RenderSection({super.key, required this.section});

  @override
  State<RenderSection> createState() => _RenderSectionState();
}

class _RenderSectionState extends State<RenderSection> {
  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
