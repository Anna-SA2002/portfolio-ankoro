import bpy, os, json
from math import sin,cos,pi
from mathutils import Vector,Quaternion
OUT=r'C:\Users\anfum\Documents\sato-create-model'
scene=bpy.context.scene
char=bpy.data.collections['CHARACTER | editable low-poly parts']
studio=bpy.data.collections['STUDIO | cameras and lighting']
# Preserve the neutral-gray palette while avoiding clipped studio highlights.
for o in studio.objects:
    if o.type=='LIGHT': o.data.energy*=.22
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'

# Align the crown/back-bob ring exactly; no visible horizontal gap in profile.
ob=bpy.data.objects['Hair bob back and sides']
for j in range(9):
    t=pi/3+j*(4*pi/3)/8
    ob.data.vertices[j].co=(.565*sin(t),.045-.44*cos(t),4.23)

# Bring collar corners back to the neck and give the tie real garment contact.
for name in ['Collar left','Collar right']:
    ob=bpy.data.objects[name]; n=len(ob.data.vertices)//2
    for i,v in enumerate(ob.data.vertices):
        v.co.y=-.25+max(0,min(1,(v.co.z-3.25)/.28))*.13+(0 if i<n else .025)
for name,y,thick in [('Tie knot',-.256,.055),('Tie blade',-.262,.045)]:
    ob=bpy.data.objects[name]; n=len(ob.data.vertices)//2
    for i,v in enumerate(ob.data.vertices):v.co.y=y+(0 if i<n else thick)
for label in ['L','R']:
    bpy.data.objects['Cuff edge '+label].data.materials[0]=bpy.data.materials['02 Ivory cotton']

# Triangular prisms give the ears a clear thickness in the side view.
for s,label in [(-1,'L'),(1,'R')]:
    ob=bpy.data.objects['Cat ear '+label]
    vs=[(s*.21,-.10,4.54),(s*.57,-.08,4.53),(s*.46,-.05,5.04)]
    vs += [(x,y+.18,z-.025) for x,y,z in vs]
    me=bpy.data.meshes.new('Thick cat ear '+label)
    me.from_pydata(vs,[],[(0,2,1),(3,4,5),(0,1,4,3),(1,2,5,4),(2,0,3,5)]); me.materials.append(bpy.data.materials['03 Silver gray hair']); me.update(); ob.data=me
    for name in ['Inner ear '+label,'Inner ear tuft '+label]:
        obj=bpy.data.objects[name]
        for v in obj.data.vertices: v.co.y += (v.co.z-4.54)*.095

# Normalize geometry to meters. All dimensions and studio transforms are baked.
S=.32
for ob in char.objects:
    if ob.type=='MESH':
        for v in ob.data.vertices:v.co*=S
for ob in studio.objects:
    ob.location*=S
    if ob.type=='CAMERA':ob.data.ortho_scale*=S; ob.data.clip_start=.01; ob.data.clip_end=100
    if ob.type=='LIGHT':ob.data.size*=S; ob.data.energy*=S*S
scene.unit_settings.system='METRIC'; scene.unit_settings.scale_length=1
scene.cycles.samples=48
verts=sum(len(o.data.vertices) for o in char.objects if o.type=='MESH')
faces=sum(len(o.data.polygons) for o in char.objects if o.type=='MESH')
tris=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in char.objects if o.type=='MESH')
stats={'objects':len(char.objects),'vertices':verts,'faces':faces,'triangles':tris,'height_m':5.04*S,'pose':'T-pose','rigged':False,'scale':'1 Blender unit = 1 meter; geometry baked'}
scene['Character statistics']=json.dumps(stats)
scene['README']='Reference-driven original low-poly cat character. Front=-Y; T-pose; actual height 1.613 meters; flat shading; no rig. Separate named meshes allow editing of hair locks, face features, clothing and accessories. Face details are geometry with thickness, no external textures. Blue eye at viewer left, gold at viewer right. 3 cameras and studio lights in separate STUDIO collection.'
doc=bpy.data.texts.get('README - model intent');doc.clear();doc.write(scene['README']+'\n\n'+json.dumps(stats,indent=2))
txt=bpy.data.texts.new('neko_refine.py');txt.write(open(__file__,encoding='utf-8').read())
with open(os.path.join(OUT,'neko_model_stats.json'),'w') as f:json.dump(stats,f,indent=2)
with open(os.path.join(OUT,'README.txt'),'w',encoding='utf-8') as f:f.write(scene['README']+'\n\n'+json.dumps(stats,indent=2))
scene.camera=bpy.data.objects['Camera THREE QUARTER']
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'Neko_TPose_LowPoly.blend'))
for name,path in [('Camera FRONT','neko_front.png'),('Camera THREE QUARTER','neko_three_quarter.png'),('Camera SIDE','neko_side.png')]:
    scene.camera=bpy.data.objects[name];scene.render.filepath=os.path.join(OUT,path);bpy.ops.render.render(write_still=True)
scene.camera=bpy.data.objects['Camera THREE QUARTER']
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'Neko_TPose_LowPoly.blend'))
print('REFINEMENT COMPLETE',stats)
