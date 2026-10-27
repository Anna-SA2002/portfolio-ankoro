import bpy,os,json,shutil
from mathutils import Vector
OUT=r'C:\Users\anfum\Documents\sato-create-model'
scene=bpy.context.scene
SOURCE=r'C:\Users\anfum\Documents\portfolio-ankoro'
for name in ['neko_create.py','neko_refine.py','neko_finalize.py']:
    shutil.copy2(os.path.join(SOURCE,name),os.path.join(OUT,name))
intent='''

制作意図:
参考図の中央の衣装とTポーズを再現し、昔のゲームアバターらしい角張ったシルエットを優先。
袖・脚・靴は主に8角断面、尻尾は6角断面にして低ポリゴンを維持。
フラットシェーディングで面を見せ、前髪は尖った独立した束、猫耳は厚みのある三角柱。
目・襟・ネクタイなどの細部もメッシュで、外部画像テクスチャは不要。
76個の名前付きメッシュは造形編集をしやすくする意図で分離。ゲームへの最適化時は必要に応じ結合する。
未リグ。アニメーション・ウェイト・ゲーム用エクスポートは未設定。
実寸約1.613m、正面方向-Y。モデルとスタジオ照明/カメラをコレクションで分離。
再生成はneko_create.py → neko_refine.py → neko_finalize.pyの順。最終blendには必要データを内包。
'''
with open(os.path.join(OUT,'README.txt'),'a',encoding='utf-8') as f:f.write(intent)
bpy.data.texts['README - model intent'].write(intent)
scene.view_settings.exposure=.6
for name,path in [('Camera FRONT','neko_front.png'),('Camera THREE QUARTER','neko_three_quarter.png'),('Camera SIDE','neko_side.png')]:
    scene.camera=bpy.data.objects[name];scene.render.filepath=os.path.join(OUT,path);bpy.ops.render.render(write_still=True)
scene.camera=bpy.data.objects['Camera THREE QUARTER']
for ob in bpy.data.collections['STUDIO | cameras and lighting'].objects:ob.hide_set(True)
area=bpy.context.area
area.type='VIEW_3D'
space=area.spaces.active
space.shading.type='SOLID';space.shading.color_type='MATERIAL';space.shading.light='STUDIO'
space.shading.show_shadows=True;space.shading.show_cavity=True
space.shading.cavity_type='BOTH';space.shading.curvature_ridge_factor=1.2;space.shading.curvature_valley_factor=1.0
space.overlay.show_overlays=False
space.region_3d.view_rotation=scene.camera.rotation_euler.to_quaternion()
space.region_3d.view_location=Vector((0,0,.82))
space.region_3d.view_distance=2.9
space.region_3d.view_perspective='ORTHO'
for ob in bpy.context.selected_objects:ob.select_set(False)
filepath=os.path.join(OUT,'Neko_TPose_LowPoly.blend')
bpy.ops.wm.save_as_mainfile(filepath=filepath)
bpy.ops.wm.open_mainfile(filepath=filepath)
