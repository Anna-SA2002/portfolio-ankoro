import bpy, math, os, json
from mathutils import Vector, Quaternion
from math import sin, cos, pi

OUT = r'C:\Users\anfum\Documents\sato-create-model'
os.makedirs(OUT, exist_ok=True)
scene = bpy.data.scenes.new('Neko - Low Polygon Character')
bpy.context.window.scene = scene
char = bpy.data.collections.new('CHARACTER | editable low-poly parts')
scene.collection.children.link(char)
studio = bpy.data.collections.new('STUDIO | cameras and lighting')
scene.collection.children.link(studio)

def material(name, color):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1)
    m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Roughness'].default_value=.85
    return m
skin=material('01 Porcelain skin',(.88,.79,.69))
white=material('02 Ivory cotton',(.88,.88,.82))
hair=material('03 Silver gray hair',(.40,.42,.43))
hairlight=material('04 Hair light facets',(.49,.51,.52))
hairdark=material('05 Hair shade facets',(.29,.32,.34))
dark=material('06 Charcoal warm wool',(.105,.10,.105))
seam=material('07 Wool edge',(.155,.145,.15))
shoe=material('08 Charcoal leather',(.085,.085,.09))
sole=material('09 Sole',(.055,.055,.065))
yellow=material('10 Pale butter yellow',(.82,.73,.35))
blue=material('11 Left iris blue',(.16,.43,.69))
gold=material('12 Right iris gold',(.73,.57,.18))
ink=material('13 Face charcoal',(.055,.062,.07))
eyeWhite=material('14 Eye ivory',(.95,.96,.91))
pink=material('15 Ear lining',(.56,.47,.47))
blush=material('16 Soft cheek',(.76,.52,.47))

def mesh(name,vs,fs,mat,coll=char):
    me=bpy.data.meshes.new(name); me.from_pydata(vs,[],fs); me.update()
    ob=bpy.data.objects.new(name,me); coll.objects.link(ob); ob.data.materials.append(mat)
    return ob

def rings(name,rings,mat,n=8):
    # Ring data: center X/Y/Z, radius X/Y. Ring layout keeps horizontal edits simple.
    vs=[]
    for x,y,z,rx,ry in rings:
        vs += [(x+rx*sin(2*pi*j/n),y-ry*cos(2*pi*j/n),z) for j in range(n)]
    fs=[tuple(reversed(range(n)))]
    for k in range(len(rings)-1):
        for j in range(n): fs.append((k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j))
    fs.append(tuple((len(rings)-1)*n+j for j in range(n)))
    return mesh(name,vs,fs,mat)

def tube(name,points,radii,mat,n=6):
    vs=[]
    for i,p in enumerate(points):
        p=Vector(p)
        tangent=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])
        tangent.normalize(); ref=Vector((0,1,0))
        if abs(tangent.dot(ref))>.9: ref=Vector((1,0,0))
        u=tangent.cross(ref).normalized(); v=tangent.cross(u).normalized()
        rad=radii[i]; a,b=(rad,rad) if isinstance(rad,(int,float)) else rad
        vs += [tuple(p+u*(a*cos(2*pi*j/n))+v*(b*sin(2*pi*j/n))) for j in range(n)]
    fs=[tuple(reversed(range(n)))]
    for k in range(len(points)-1):
        for j in range(n):fs.append((k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j))
    fs.append(tuple((len(points)-1)*n+j for j in range(n)))
    return mesh(name,vs,fs,mat)

def plate(name,coords,y,mat,depth=.01):
    vs=[(x,y,z) for x,z in coords]+[(x,y+depth,z) for x,z in coords]
    n=len(coords); fs=[tuple(reversed(range(n))),tuple(range(n,2*n))]
    fs += [(j,(j+1)%n,(j+1)%n+n,j+n) for j in range(n)]
    return mesh(name,vs,fs,mat)

def line(name,points,width,mat): return tube(name,points,[width]*len(points),mat,4)

# BODY: a stylised, clothed T pose, front along -Y, height approximately 1.6 m after scale.
rings('Neck',[(0,0,3.35,.115,.115),(0,0,3.72,.12,.115)],skin)
rings('Shirt torso',[(0,0,2.59,.40,.205),(0,0,3.17,.39,.215),(0,0,3.40,.44,.19),(0,0,3.48,.17,.15)],white)
rings('Vest main silhouette',[(0,0,2.59,.49,.245),(0,0,2.68,.475,.24),(0,0,3.15,.365,.225),(0,0,3.35,.41,.21)],dark)
# V-neck front is a deliberate opening outlined by two angular lapel strips.
plate('Ivory V opening',[(-.21,3.43),(0,3.01),(.21,3.43)],-.221,white)
plate('Vest neck edge L',[(-.38,3.38),(-.22,3.44),(-.065,3.02),(-.16,3.17)],-.243,seam)
plate('Vest neck edge R',[(.22,3.44),(.38,3.38),(.16,3.17),(.065,3.02)],-.243,seam)
plate('Collar left',[(-.13,3.53),(-.255,3.43),(-.17,3.23),(-.015,3.38)],-.264,white)
plate('Collar right',[(.13,3.53),(.255,3.43),(.17,3.23),(.015,3.38)],-.264,white)
plate('Tie knot',[(-.067,3.385),(.067,3.385),(.048,3.275),(-.042,3.275)],-.287,yellow)
plate('Tie blade',[(-.043,3.29),(-.102,2.95),(0,2.84),(.102,2.95),(.043,3.29)],-.291,yellow)
rings('Shorts waistband',[(0,0,2.49,.465,.238),(0,0,2.65,.455,.232)],dark)
for s,label in [(-1,'L'),(1,'R')]:
    x=s*.265
    rings('Shorts leg '+label,[(x,0,1.96,.255,.24),(x,0,2.09,.258,.246),(s*.245,0,2.48,.27,.245),(s*.225,0,2.60,.25,.23)],dark)
    rings('Shorts cuff '+label,[(x,0,1.96,.255,.244),(x,0,2.07,.26,.249)],seam)
    rings('Bare leg '+label,[(s*.28,0,.64,.119,.125),(s*.285,.01,.96,.125,.13),(s*.28,.008,1.36,.14,.137),(s*.27,0,1.93,.164,.158),(s*.27,0,2.10,.171,.168)],skin)
    rings('Sock '+label,[(s*.28,-.006,.28,.14,.15),(s*.28,0,.62,.126,.137),(s*.283,0,.91,.132,.141)],white)
    rings('Sock yellow stripe '+label,[(s*.283,0,.829,.135,.144),(s*.283,0,.861,.135,.144)],yellow)
    rings('Sock top welt '+label,[(s*.283,0,.891,.136,.145),(s*.283,0,.922,.136,.145)],white)
    # Broad toe silhouette with octagonal loops; toe points forward (-Y).
    rings('Shoe sole '+label,[(s*.28,-.135,.035,.216,.341),(s*.28,-.135,.13,.22,.345)],sole)
    rings('Shoe upper '+label,[(s*.28,-.135,.13,.219,.343),(s*.28,-.14,.265,.211,.331),(s*.28,-.07,.345,.165,.227),(s*.28,.0,.375,.145,.152)],shoe)
    line('Shoe vamp seam '+label,[(s*.28-.135,-.26,.285),(s*.28,-.31,.285),(s*.28+.135,-.26,.285)],.009,seam)
    # Long bell sleeves: restrained shoulder taper and clearly readable square cuffs.
    tube('Sleeve '+label,[(s*.37,0,3.34),(s*.66,0,3.33),(s*1.14,0,3.32),(s*1.64,0,3.31)],[.205,.195,.23,.245],white,8)
    tube('Sleeve cuff '+label,[(s*1.49,0,3.312),(s*1.65,0,3.309)],[(.247,.247),(.247,.247)],white,8)
    tube('Cuff edge '+label,[(s*1.64,0,3.31),(s*1.665,0,3.31)],[.249,.249],seam,8)
    # Palms and simplified mitten fingers maintain the reference's relaxed T pose.
    tube('Hand '+label,[(s*1.65,0,3.31),(s*1.83,-.012,3.30),(s*2.04,-.015,3.295),(s*2.10,-.01,3.30)],[(.075,.095),(.068,.12),(.044,.10),(.025,.05)],skin,6)
    tube('Thumb '+label,[(s*1.80,-.045,3.27),(s*1.85,-.13,3.235),(s*1.96,-.15,3.245)],[.057,.045,.02],skin,5)

# FACE: a low-poly volume with a flattened front for crisp anime features.
n=12; vs=[]
headrings=[(3.64,.07,.10),(3.71,.29,.255),(3.89,.45,.335),(4.12,.49,.37),(4.35,.47,.355),(4.50,.35,.27),(4.57,.10,.10)]
for z,rx,ry in headrings:
    for j in range(n):
        th=2*pi*j/n; xx=rx*sin(th); yy=-ry*cos(th)
        if cos(th)>.45 and 3.8<z<4.4: yy=-.367
        vs.append((xx,yy,z))
fs=[tuple(reversed(range(n)))]
for k in range(len(headrings)-1):
    for j in range(n):fs.append((k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j))
fs.append(tuple((len(headrings)-1)*n+j for j in range(n)))
mesh('Face angular silhouette',vs,fs,skin)

for s,label,col in [(-1,'L BLUE',blue),(1,'R GOLD',gold)]:
    cx=s*.22; cz=4.035
    # Eyeliner reads as a clean angular silhouette even at small on-screen size.
    coords=[(-.137,.10),(-.105,.147),(.078,.146),(.129,.083),(.115,-.10),(.065,-.137),(-.066,-.133),(-.116,-.073)]
    plate('Eye outline '+label,[(cx+a,cz+b) for a,b in coords],-.381,ink)
    coords=[(-.111,.082),(-.080,.119),(.067,.12),(.103,.066),(.091,-.09),(.052,-.111),(-.055,-.11),(-.091,-.061)]
    plate('Eye white '+label,[(cx+a,cz+b) for a,b in coords],-.386,eyeWhite)
    coords=[(-.060,.112),(.047,.112),(.07,.062),(.062,-.079),(.026,-.106),(-.038,-.098),(-.067,-.045)]
    plate('Iris '+label,[(cx+a,cz+b) for a,b in coords],-.391,col)
    plate('Pupil '+label,[(cx-.021,cz+.093),(cx+.02,cz+.093),(cx+.017,cz-.05),(cx-.017,cz-.068)],-.396,ink)
    plate('Eye glint '+label,[(cx-.045,cz+.079),(cx-.007,cz+.079),(cx-.007,cz+.040),(cx-.045,cz+.040)],-.401,eyeWhite)
    line('Upper lash '+label,[(cx-.131,-.391,cz+.114),(cx-.082,-.392,cz+.145),(cx+.086,-.392,cz+.143)],.013,ink)
    line('Brow '+label,[(cx-.10,-.37,4.235),(cx+.09,-.37,4.247)],.012,hairdark)
    plate('Cheek '+label,[(cx-.10,3.85),(cx-.05,3.866),(cx+.025,3.85),(cx+.00,3.827),(cx-.08,3.827)],-.350,blush)
mesh('Small nose',[(0,-.386,3.963),(-.037,-.364,3.916),(.037,-.364,3.916),(0,-.423,3.925)],[(0,1,3),(0,3,2),(1,2,3)],skin)
line('Mouth', [(-.055,-.330,3.805),(0,-.349,3.79),(.055,-.330,3.805)],.009,ink)

# BOB: crown facets and an open face, separate pointed locks rather than a sphere.
n=12; vs=[]
for z,rx,ry in [(4.23,.565,.44),(4.52,.49,.40),(4.67,.27,.24),(4.70,.04,.06)]:
    vs += [(rx*sin(2*pi*j/n),.045-ry*cos(2*pi*j/n),z) for j in range(n)]
fs=[]
for k in range(3):
    for j in range(n): fs.append((k*n+j,k*n+(j+1)%n,(k+1)*n+(j+1)%n,(k+1)*n+j))
fs.append(tuple(36+j for j in range(n)))
ob=mesh('Hair crown faceted',vs,fs,hair); ob.data.materials.append(hairlight); ob.data.materials.append(hairdark)
for p in ob.data.polygons: p.material_index=1 if p.index%12 in (0,1,11) else (2 if p.index%12 in (5,6) else 0)
# Back bob includes sides but leaves a broad front window for the face.
angles=[pi/3+i*(4*pi/3)/8 for i in range(9)]; vs=[]
for k in range(3):
    z=[4.36,3.93,3.66][k]; rx=[.53,.555,.43][k]; ry=[.42,.44,.33][k]
    vs += [(rx*sin(t),.055-ry*cos(t),z+(0 if k<2 else .045*cos(t*3))) for t in angles]
fs=[]
for k in range(2):
    for j in range(8):fs.append((k*9+j,k*9+j+1,(k+1)*9+j+1,(k+1)*9+j))
mesh('Hair bob back and sides',vs,fs,hair)

def lock(name,topL,topR,tip,width=.06,mat=hair):
    # Each lock is a four-sided wedge with a visible longitudinal ridge.
    l=Vector(topL); r=Vector(topR); t=Vector(tip); mid=(l+r+t)/3; mid.y-=width
    back=[tuple(l+Vector((0,.07,0))),tuple(r+Vector((0,.07,0))),tuple(t+Vector((0,.05,0)))]
    return mesh(name,[tuple(l),tuple(r),tuple(t),tuple(mid)]+back,[(0,3,1),(1,3,2),(2,3,0),(4,5,6),(0,1,5,4),(1,2,6,5),(2,0,4,6)],mat)
lock('Bang outer left',(-.43,-.27,4.49),(-.25,-.36,4.56),(-.475,-.42,3.95),.035)
lock('Bang middle left',(-.25,-.36,4.58),(-.06,-.39,4.62),(-.30,-.424,4.22),.035,hairlight)
lock('Bang center',(-.085,-.40,4.61),(.115,-.40,4.60),(.065,-.448,4.155),.03)
lock('Bang middle right',(.10,-.39,4.60),(.31,-.35,4.55),(.35,-.427,4.215),.035,hairlight)
lock('Bang outer right',(.30,-.33,4.53),(.46,-.25,4.44),(.48,-.41,3.96),.035)
for s,label in [(-1,'L'),(1,'R')]:
    lock('Bob face-framing lock '+label,(s*.45,-.245,4.36),(s*.57,-.10,4.21),(s*.46,-.31,3.63),.04,hair)
    lock('Bob side point '+label,(s*.55,-.02,4.18),(s*.545,.17,4.19),(s*.43,.06,3.62),.025,hairdark)
    # Thick triangular ears have a broad base and a small inset lining.
    vs=[(s*.21,-.10,4.54),(s*.57,-.08,4.53),(s*.46,-.05,5.04),(s*.37,.105,4.65)]
    mesh('Cat ear '+label,vs,[(0,2,1),(0,3,2),(2,3,1),(1,3,0)],hair)
    plate('Inner ear '+label,[(s*.28,4.59),(s*.505,4.585),(s*.447,4.927)],-.113,pink)
    plate('Inner ear tuft '+label,[(s*.34,4.62),(s*.45,4.81),(s*.455,4.66),(s*.48,4.62)],-.12,hairlight)

tube('Cat tail',[(0,.21,2.32),(.21,.36,2.25),(.48,.43,2.05),(.71,.44,1.78),(.83,.44,1.52),(.81,.45,1.32),(.94,.46,1.16),(1.02,.46,1.18)],[.083,.081,.076,.071,.068,.064,.055,.025],hair,6)

# Lighting and presentation stay separate from the editable character.
world=bpy.data.worlds.new('Warm gray studio'); world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.42,.45,.48,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.65; scene.world=world
def camera(name,loc,target,scale):
    ca=bpy.data.cameras.new(name); ob=bpy.data.objects.new(name,ca); studio.objects.link(ob); ob.location=loc
    ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler(); ca.type='ORTHO'; ca.ortho_scale=scale; return ob
front=camera('Camera FRONT',(0,-12,2.56),(0,0,2.56),5.8)
hero=camera('Camera THREE QUARTER',(7,-15,7.0),(0,0,2.55),5.8)
side=camera('Camera SIDE',(12,0,2.56),(0,0,2.56),5.8)
for name,loc,power,size in [('Key',(-3,-6,8),900,5),('Fill',(4,-4,5),600,4),('Rim',(2,4,7),1100,3)]:
    d=bpy.data.lights.new(name,'AREA'); d.energy=power; d.shape='DISK'; d.size=size
    ob=bpy.data.objects.new(name,d); studio.objects.link(ob); ob.location=loc; ob.rotation_euler=(Vector((0,0,2.7))-ob.location).to_track_quat('-Z','Y').to_euler()
scene.render.engine='CYCLES'; scene.cycles.samples=24
scene.render.resolution_x=1000; scene.render.resolution_y=1100; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'; scene.render.film_transparent=False
scene.view_settings.view_transform='Standard'
scene.camera=hero
scene['README']='Low-poly T-pose character based on user front/outfit/side reference. Front = -Y. Unrigged. Separate editable meshes; flat shading. Original palette and geometry. Studio cameras excluded from mesh count.'
scene.unit_settings.system='METRIC'; scene.unit_settings.scale_length=.32
for ob in char.objects:
    ob['part_of']='Neko avatar'; ob['style']='flat shaded, low polygon'
verts=sum(len(o.data.vertices) for o in char.objects if o.type=='MESH')
faces=sum(len(o.data.polygons) for o in char.objects if o.type=='MESH')
tris=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in char.objects if o.type=='MESH')
stats={'objects':len(char.objects),'vertices':verts,'faces':faces,'triangles':tris,'height_m':5.04*.32,'pose':'T-pose','rigged':False}
scene['Character statistics']=json.dumps(stats)
with open(os.path.join(OUT,'neko_model_stats.json'),'w') as f: json.dump(stats,f,indent=2)
text=bpy.data.texts.new('README - model intent'); text.write(scene['README']+'\n\n'+json.dumps(stats,indent=2))
script=bpy.data.texts.new('neko_create.py'); script.from_string(open(__file__,encoding='utf-8').read())
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'Neko_TPose_LowPoly.blend'))
scene.camera=front; scene.render.filepath=os.path.join(OUT,'neko_front.png'); bpy.ops.render.render(write_still=True)
scene.camera=hero; scene.render.filepath=os.path.join(OUT,'neko_three_quarter.png'); bpy.ops.render.render(write_still=True)
scene.camera=side; scene.render.filepath=os.path.join(OUT,'neko_side.png'); bpy.ops.render.render(write_still=True)
scene.camera=hero
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'Neko_TPose_LowPoly.blend'))
print('NEKO COMPLETE',stats)
