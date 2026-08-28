update public.investigation_steps
set payload = payload || jsonb_build_object('diff', jsonb_build_array(
  jsonb_build_object('file','api/serializers.py','lines', jsonb_build_array(
    jsonb_build_object('type','meta','text','@@ -42,7 +42,7 @@ class SoilAdvisorySerializer(serializers.ModelSerializer):'),
    jsonb_build_object('type','ctx','text','     class Meta:'),
    jsonb_build_object('type','ctx','text','         model = SoilAdvisory'),
    jsonb_build_object('type','del','text','         fields = ["id", "ph_level", "moisture", "advisory"]'),
    jsonb_build_object('type','add','text','         fields = ["id", "soil_ph", "moisture", "advisory"]'),
    jsonb_build_object('type','ctx','text',''),
    jsonb_build_object('type','del','text','     ph_level = serializers.FloatField(source="soil.ph")'),
    jsonb_build_object('type','add','text','     soil_ph = serializers.FloatField(source="soil.ph")')
  )),
  jsonb_build_object('file','tests/factories.py','lines', jsonb_build_array(
    jsonb_build_object('type','meta','text','@@ -18,7 +18,7 @@ class SoilAdvisoryFactory(factory.django.DjangoModelFactory):'),
    jsonb_build_object('type','del','text','     ph_level = 6.4'),
    jsonb_build_object('type','add','text','     soil_ph = 6.4')
  )),
  jsonb_build_object('file','tests/fixtures/soil.json','lines', jsonb_build_array(
    jsonb_build_object('type','meta','text','@@ -3,7 +3,7 @@'),
    jsonb_build_object('type','del','text','   "ph_level": 6.4,'),
    jsonb_build_object('type','add','text','   "soil_ph": 6.4,')
  ))
))
where kind = 'licence_required';