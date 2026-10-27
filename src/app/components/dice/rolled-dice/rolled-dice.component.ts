import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import {
    AmbientLight,
    BoxGeometry,
    BufferGeometry,
    CanvasTexture,
    DirectionalLight,
    DodecahedronGeometry,
    DoubleSide,
    Float32BufferAttribute,
    Group,
    IcosahedronGeometry,
    MathUtils,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    OctahedronGeometry,
    PerspectiveCamera,
    PlaneGeometry,
    Quaternion,
    Scene,
    SRGBColorSpace,
    TetrahedronGeometry,
    Texture,
    Vector3,
    WebGLRenderer,
} from 'three';

interface DiceFace {
    number: number;
    normal: Vector3;
    centre: Vector3;
    up: Vector3;
}

interface FaceGroup {
    normal: Vector3;
    planeConstant: number;
    points: Vector3[];
}

@Component({
    selector: 'app-rolled-dice',
    standalone: true,
    imports: [],
    templateUrl: './rolled-dice.component.html',
})
export class RolledDiceComponent implements AfterViewInit, OnChanges, OnDestroy {
    /**
     * Select the die displayed by the component.
     *
     * Examples:
     * <app-rolled-dice [sides]="20"></app-rolled-dice>
     * <app-rolled-dice [sides]="12"></app-rolled-dice>
     */
    @Input() public sides: number = 20;

    @ViewChild('diceCanvas', { static: true })
    private canvasRef!: ElementRef<HTMLCanvasElement>;

    public result: number | null = null;
    public rolling = false;
    public showDice = false;

    private renderer!: WebGLRenderer;
    private scene!: Scene;
    private camera!: PerspectiveCamera;

    private diceGroup!: Group;
    private diceMesh!: Mesh;

    private faces: DiceFace[] = [];

    /**
     * Actual scaled radius of the current die.
     *
     * This is used to keep the die inside the visible camera area.
     */
    private diceRadius = 0;

    private animationFrame: number | null = null;
    private rollAnimationFrame: number | null = null;
    private timeoutId: number | null = null;

    private viewInitialised = false;
    private canvasWidth = 0;
    private canvasHeight = 0;
    private pixelRatio = 0;

    private resizeRenderer(): void {
        const canvas = this.canvasRef.nativeElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        // A hidden or detached canvas must not produce an invalid projection.
        if (width === 0 || height === 0) {
            return;
        }

        if (width === this.canvasWidth && height === this.canvasHeight &&
            pixelRatio === this.pixelRatio) {
            return;
        }

        this.canvasWidth = width;
        this.canvasHeight = height;
        this.pixelRatio = pixelRatio;
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    public ngAfterViewInit(): void {
        this.initScene();
        this.createDice(this.sides);
        this.render();

        this.viewInitialised = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['sides'] &&
            !changes['sides'].firstChange &&
            this.viewInitialised
        ) {
            this.createDice(this.sides);
        }
    }

    public ngOnDestroy(): void {
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
        }

        if (this.rollAnimationFrame !== null) {
            cancelAnimationFrame(this.rollAnimationFrame);
        }

        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
        }

        if (this.diceGroup) {
            this.disposeObject(this.diceGroup);
        }

        this.renderer?.dispose();
    }

    private initScene(): void {
        const canvas = this.canvasRef.nativeElement;

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            45,
            1,
            0.1,
            100
        );

        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });

        this.resizeRenderer();

        const ambientLight = new AmbientLight(
            0xff0000,
            2
        );

        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(
            0xffffff,
            4
        );

        directionalLight.position.set(4, 5, 5);

        this.scene.add(directionalLight);
    }

    /**
     * Creates or replaces the currently displayed die.
     */
    private createDice(sides: number): void {
        this.faces = [];
        this.result = null;
        this.rolling = false;

        if (this.rollAnimationFrame !== null) {
            cancelAnimationFrame(this.rollAnimationFrame);
            this.rollAnimationFrame = null;
        }

        if (this.diceGroup) {
            this.scene.remove(this.diceGroup);
            this.disposeObject(this.diceGroup);
        }

        this.diceGroup = new Group();

        const originalGeometry =
            this.createGeometryForDice(sides);

        /*
         * Converting to non-indexed geometry means that each rendered
         * triangle has three consecutive vertices. This makes logical
         * face detection considerably simpler.
         */
        const geometry = originalGeometry.index
            ? originalGeometry.toNonIndexed()
            : originalGeometry.clone();

        originalGeometry.dispose();

        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        const material = new MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.35,
            metalness: 0.15,
            flatShading: true,
        });

        this.diceMesh = new Mesh(
            geometry,
            material
        );

        this.diceGroup.add(this.diceMesh);

        /*
         * This preserves the scale used by your existing D20.
         */
        const diceScale = this.getDiceScale(sides);

        this.diceGroup.scale.setScalar(diceScale);

        /*
         * Calculate a safe visible radius from the actual geometry.
         */
        this.diceRadius =
            (geometry.boundingSphere?.radius ?? 1.5) *
            diceScale;

        this.createFacesAndNumbers(
            geometry,
            sides
        );

        this.scene.add(this.diceGroup);
    }

    /**
     * Returns the correct geometry for each supported die.
     */
    private createGeometryForDice(
        sides: number
    ): BufferGeometry {
        const radius = 1.5;

        switch (sides) {
            case 4:
                return new TetrahedronGeometry(
                    radius,
                    0
                );

            case 6:
                return new BoxGeometry(
                    2.2,
                    2.2,
                    2.2
                );

            case 8:
                return new OctahedronGeometry(
                    radius,
                    0
                );

            case 10:
                return this.createD10Geometry(
                    radius
                );

            case 12:
                return new DodecahedronGeometry(
                    radius,
                    0
                );

            case 20:
                return new IcosahedronGeometry(
                    radius,
                    0
                );
            default:
                return new IcosahedronGeometry(
                    radius,
                    0
                );
        }
    }

    /**
     * Builds a ten-faced pentagonal bipyramid.
     *
     * It consists of:
     * - one top point;
     * - one bottom point;
     * - five points around the middle;
     * - five upper triangular faces;
     * - five lower triangular faces.
     */
    private createD10Geometry(
        radius: number
    ): BufferGeometry {
        const vertices: number[] = [];
        const indices: number[] = [];

        /*
         * Top and bottom vertices.
         */
        vertices.push(
            0, radius, 0,
            0, -radius, 0
        );

        const topIndex = 0;
        const bottomIndex = 1;
        const firstRingIndex = 2;

        /*
         * Five vertices around the middle.
         */
        for (let index = 0; index < 5; index++) {
            const angle =
                (index / 5) * Math.PI * 2 -
                Math.PI / 2;

            vertices.push(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
        }

        for (let index = 0; index < 5; index++) {
            const current =
                firstRingIndex + index;

            const next =
                firstRingIndex +
                ((index + 1) % 5);

            /*
             * Upper triangular face.
             */
            indices.push(
                topIndex,
                current,
                next
            );

            /*
             * Lower triangular face.
             *
             * The winding order is reversed so that its normal points
             * away from the centre of the die.
             */
            indices.push(
                bottomIndex,
                next,
                current
            );
        }

        const geometry = new BufferGeometry();

        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(
                vertices,
                3
            )
        );

        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }

    /**
     * Converts the rendered triangles into logical die faces.
     *
     * Triangular dice faces already contain one triangle each.
     * Square and pentagonal faces contain several coplanar triangles,
     * which are grouped together here.
     */
    private createFacesAndNumbers(
        geometry: BufferGeometry,
        sides: number
    ): void {
        const positions =
            geometry.getAttribute('position');

        const faceGroups: FaceGroup[] = [];

        for (
            let vertexIndex = 0;
            vertexIndex < positions.count;
            vertexIndex += 3
        ) {
            const a = new Vector3()
                .fromBufferAttribute(
                    positions,
                    vertexIndex
                );

            const b = new Vector3()
                .fromBufferAttribute(
                    positions,
                    vertexIndex + 1
                );

            const c = new Vector3()
                .fromBufferAttribute(
                    positions,
                    vertexIndex + 2
                );

            const triangleCentre = new Vector3()
                .add(a)
                .add(b)
                .add(c)
                .divideScalar(3);

            const normal = new Vector3()
                .subVectors(b, a)
                .cross(
                    new Vector3()
                        .subVectors(c, a)
                )
                .normalize();

            /*
             * Ensure that the normal points away from the centre
             * of the die.
             */
            if (normal.dot(triangleCentre) < 0) {
                normal.negate();
            }

            /*
             * Plane constant from:
             *
             * normal · point = planeConstant
             */
            const planeConstant =
                normal.dot(a);

            const existingFace =
                faceGroups.find(
                    face =>
                        face.normal.dot(normal) >
                        0.9999 &&
                        Math.abs(
                            face.planeConstant -
                            planeConstant
                        ) < 0.001
                );

            if (existingFace) {
                existingFace.points.push(
                    a,
                    b,
                    c
                );

                continue;
            }

            faceGroups.push({
                normal: normal.clone(),
                planeConstant,
                points: [
                    a.clone(),
                    b.clone(),
                    c.clone(),
                ],
            });
        }

        if (faceGroups.length !== sides) {
            throw new Error(
                `Expected D${sides} to have ${sides} faces, ` +
                `but ${faceGroups.length} logical faces were found.`
            );
        }

        faceGroups.forEach(
            (faceGroup, faceIndex) => {
                const uniquePoints =
                    this.getUniquePoints(
                        faceGroup.points
                    );

                const centre = new Vector3();

                for (const point of uniquePoints) {
                    centre.add(point);
                }

                centre.divideScalar(
                    uniquePoints.length
                );

                const faceUp =
                    this.calculateFaceUp(
                        centre,
                        faceGroup.normal,
                        uniquePoints
                    );

                const number = faceIndex + 1;

                this.faces.push({
                    number,
                    normal:
                        faceGroup.normal.clone(),
                    centre: centre.clone(),
                    up: faceUp.clone(),
                });

                const numberMesh =
                    this.createNumberMesh(
                        number,
                        sides
                    );

                numberMesh.position.copy(
                    centre
                        .clone()
                        .addScaledVector(
                            faceGroup.normal,
                            0.015
                        )
                );

                numberMesh.quaternion.copy(
                    this.createFaceQuaternion(
                        faceGroup.normal,
                        faceUp
                    )
                );

                this.diceGroup.add(numberMesh);
            }
        );
    }

    /**
     * Removes duplicate triangle vertices from one logical face.
     */
    private getUniquePoints(
        points: Vector3[]
    ): Vector3[] {
        const uniquePoints: Vector3[] = [];

        for (const point of points) {
            const alreadyExists =
                uniquePoints.some(
                    existingPoint =>
                        existingPoint
                            .distanceToSquared(point) <
                        0.000001
                );

            if (!alreadyExists) {
                uniquePoints.push(
                    point.clone()
                );
            }
        }

        return uniquePoints;
    }

    /**
     * Determines which direction should count as "up" on a face.
     *
     * This is used both to orient the label and to keep the result
     * upright when it faces the camera.
     */
    private calculateFaceUp(
        centre: Vector3,
        normal: Vector3,
        points: Vector3[]
    ): Vector3 {
        let highestPoint = points[0];

        for (const point of points) {
            if (point.y > highestPoint.y) {
                highestPoint = point;
            }
        }

        const faceUp = highestPoint
            .clone()
            .sub(centre)
            .projectOnPlane(normal)
            .normalize();

        /*
         * A horizontal face may not have a useful highest vertex.
         */
        if (faceUp.lengthSq() < 0.000001) {
            faceUp
                .set(0, 0, 1)
                .projectOnPlane(normal)
                .normalize();
        }

        /*
         * Additional fallback in case normal is also aligned with Z.
         */
        if (faceUp.lengthSq() < 0.000001) {
            faceUp
                .set(1, 0, 0)
                .projectOnPlane(normal)
                .normalize();
        }

        return faceUp;
    }

    /**
     * Produces the complete face orientation:
     *
     * local X = face right
     * local Y = face up
     * local Z = face normal
     */
    private createFaceQuaternion(
        normal: Vector3,
        faceUp: Vector3
    ): Quaternion {
        const faceNormal =
            normal.clone().normalize();

        const right = new Vector3()
            .crossVectors(
                faceUp,
                faceNormal
            )
            .normalize();

        const correctedUp = new Vector3()
            .crossVectors(
                faceNormal,
                right
            )
            .normalize();

        const rotationMatrix = new Matrix4()
            .makeBasis(
                right,
                correctedUp,
                faceNormal
            );

        return new Quaternion()
            .setFromRotationMatrix(
                rotationMatrix
            );
    }

    /**
     * Creates one number texture and plane.
     */
    private createNumberMesh(
        number: number,
        sides: number
    ): Mesh {
        const canvas =
            document.createElement('canvas');

        canvas.width = 512;
        canvas.height = 512;

        const context =
            canvas.getContext('2d');

        if (!context) {
            throw new Error(
                'Could not create number canvas context.'
            );
        }

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.fillStyle = '#ffffff';
        context.font =
            'bold 300px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText(
            number.toString(),
            canvas.width / 2,
            canvas.height / 2
        );

        const texture =
            new CanvasTexture(canvas);

        texture.colorSpace =
            SRGBColorSpace;

        texture.needsUpdate = true;

        const material =
            new MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthTest: true,
                depthWrite: false,
                side: DoubleSide,
            });

        const numberSize =
            this.getNumberSize(sides);

        const geometry =
            new PlaneGeometry(
                numberSize,
                numberSize
            );

        return new Mesh(
            geometry,
            material
        );
    }

    private getNumberSize(
        sides: number
    ): number {
        switch (sides) {
            case 4:
                return 0.85;

            case 6:
                return 1.1;

            case 8:
                return 0.75;

            case 10:
                return 0.7;

            case 12:
                return 0.85;

            case 20:
                return 0.6;
            default:
                return 0.6;
        }
    }

    /**
     * Keeps the displayed dice at roughly similar visual sizes.
     */
    private getDiceScale(
        sides: number
    ): number {
        switch (sides) {
            case 4:
                return 0.25;

            case 6:
                return 0.25;

            case 8:
                return 0.25;

            case 10:
                return 0.25;

            case 12:
                return 0.25;

            case 20:
                return 0.25;
            default:
                return 0.25;
        }
    }

    /**
     * Rolls the current die to a supplied result.
     *
     * Examples:
     *
     * D20: roll(17)
     * D12: roll(8)
     * D6:  roll(4)
     */
    public roll(rollValue: number): void {
        if (this.rolling) {
            return;
        }

        if (
            !Number.isInteger(rollValue) ||
            rollValue < 1 ||
            rollValue > this.sides
        ) {
            throw new Error(
                `A D${this.sides} result must be an integer ` +
                `between 1 and ${this.sides}. Received ${rollValue}.`
            );
        }

        if (this.timeoutId !== null) {
            window.clearTimeout(
                this.timeoutId
            );

            this.timeoutId = null;
        }

        if (this.rollAnimationFrame !== null) {
            cancelAnimationFrame(
                this.rollAnimationFrame
            );

            this.rollAnimationFrame = null;
        }

        this.rolling = true;
        this.showDice = true;
        this.result = rollValue;

        this.timeoutId =
            window.setTimeout(() => {
                this.showDice = false;
                this.timeoutId = null;
            }, 5000);

        const face = this.faces.find(
            currentFace =>
                currentFace.number ===
                this.result
        );

        if (!face) {
            this.rolling = false;

            throw new Error(
                `No face was found for D${this.sides} ` +
                `result ${this.result}.`
            );
        }

        this.resizeRenderer();

        const diceZ = 0;
        const visible =
            this.getVisibleSizeAtZ(diceZ);

        const padding = 0.2;
        const bounceHeight = 0.35;
        const bounceCount = 4;

        /*
         * Safe horizontal limits for the centre of the die.
         */
        const minX =
            -visible.width / 2 +
            this.diceRadius +
            padding;

        const maxX =
            visible.width / 2 -
            this.diceRadius -
            padding;

        /*
         * Safe vertical limits for the centre of the die.
         *
         * bounceHeight is removed from maxY because the bounce
         * pushes the die upwards.
         */
        const minY =
            -visible.height / 2 +
            this.diceRadius +
            padding;

        const maxY =
            visible.height / 2 -
            this.diceRadius -
            padding -
            bounceHeight;

        /*
         * Guard against extremely small canvases.
         */
        const safeMinX =
            Math.min(minX, maxX);

        const safeMaxX =
            Math.max(minX, maxX);

        const safeMinY =
            Math.min(minY, maxY);

        const safeMaxY =
            Math.max(minY, maxY);

        const startPosition = new Vector3(
            safeMinX,
            MathUtils.randFloat(
                safeMinY,
                safeMaxY
            ),
            diceZ
        );

        const endPosition = new Vector3(
            safeMaxX,
            MathUtils.randFloat(
                safeMinY,
                safeMaxY
            ),
            diceZ
        );

        this.diceGroup.position.copy(
            startPosition
        );

        /*
         * Calculate the final position in world coordinates.
         */
        const landingWorldPosition =
            endPosition.clone();

        if (this.diceGroup.parent) {
            this.diceGroup.parent.localToWorld(
                landingWorldPosition
            );
        }

        const cameraPosition =
            new Vector3();

        this.camera.getWorldPosition(
            cameraPosition
        );

        /*
         * Direction from the final die position towards the camera.
         */
        const cameraDirection =
            cameraPosition
                .sub(landingWorldPosition)
                .normalize();

        /*
         * First rotate the result face so its normal points towards
         * the camera.
         */
        const landingQuaternion =
            new Quaternion()
                .setFromUnitVectors(
                    face.normal
                        .clone()
                        .normalize(),
                    cameraDirection
                );

        /*
         * Determine where the face's own up direction points after
         * applying the camera-facing rotation.
         */
        const rotatedFaceUp =
            face.up
                .clone()
                .applyQuaternion(
                    landingQuaternion
                );

        /*
         * Calculate the camera's visual up direction.
         */
        const desiredUp =
            this.camera.up
                .clone()
                .applyQuaternion(
                    this.camera.quaternion
                )
                .projectOnPlane(
                    cameraDirection
                )
                .normalize();

        const currentUp =
            rotatedFaceUp
                .projectOnPlane(
                    cameraDirection
                )
                .normalize();

        /*
         * Twist the face around its camera-facing normal so that
         * the number appears upright on the screen.
         */
        let twistAngle =
            currentUp.angleTo(
                desiredUp
            );

        const cross = new Vector3()
            .crossVectors(
                currentUp,
                desiredUp
            );

        if (
            cross.dot(cameraDirection) < 0
        ) {
            twistAngle = -twistAngle;
        }

        const twistQuaternion =
            new Quaternion()
                .setFromAxisAngle(
                    cameraDirection,
                    twistAngle
                );

        landingQuaternion.premultiply(
            twistQuaternion
        );

        /*
         * Random tumbling axis.
         */
        const angularAxis = new Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        );

        if (
            angularAxis.lengthSq() <
            0.000001
        ) {
            angularAxis.set(1, 1, 1);
        }

        angularAxis.normalize();

        const startTime =
            performance.now();

        let previousTime = startTime;

        const duration = 1800;

        const animateRoll = (
            time: number
        ): void => {
            const elapsed =
                time - startTime;

            const deltaSeconds =
                Math.min(
                    (time - previousTime) /
                    1000,
                    0.05
                );

            previousTime = time;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            /*
             * Move from the random start point to the random end point.
             */
            const movementProgress =
                this.easeOutCubic(
                    progress
                );

            this.diceGroup.position
                .lerpVectors(
                    startPosition,
                    endPosition,
                    movementProgress
                );

            /*
             * Add the bounce after interpolation.
             *
             * Using += preserves the interpolated random Y path.
             */
            const bounce =
                Math.abs(
                    Math.sin(
                        progress *
                        Math.PI *
                        bounceCount
                    )
                ) *
                bounceHeight *
                (1 - progress);

            this.diceGroup.position.y +=
                bounce;

            /*
             * Fast initial spin that gradually slows down.
             */
            const spinSpeed =
                MathUtils.lerp(
                    22,
                    0,
                    this.easeOutCubic(
                        progress
                    )
                );

            const incrementalRotation =
                new Quaternion()
                    .setFromAxisAngle(
                        angularAxis,
                        spinSpeed *
                        deltaSeconds
                    );

            this.diceGroup.quaternion
                .multiply(
                    incrementalRotation
                );

            /*
             * Gradually steer towards the selected result.
             */
            const steeringStart = 0.35;

            if (
                progress >
                steeringStart
            ) {
                const steeringProgress =
                    (progress -
                        steeringStart) /
                    (1 -
                        steeringStart);

                const steeringStrength =
                    MathUtils.lerp(
                        0.01,
                        0.35,
                        this.easeOutCubic(
                            steeringProgress
                        )
                    );

                this.diceGroup.quaternion
                    .slerp(
                        landingQuaternion,
                        steeringStrength
                    );
            }

            if (progress < 1) {
                this.rollAnimationFrame =
                    requestAnimationFrame(
                        animateRoll
                    );

                return;
            }

            /*
             * Do not copy endPosition here.
             *
             * The final interpolation frame already established the
             * position. Copying it again caused the jump you previously
             * encountered.
             */
            this.diceGroup.quaternion.copy(
                landingQuaternion
            );

            this.rollAnimationFrame =
                null;

            this.rolling = false;
        };

        this.rollAnimationFrame =
            requestAnimationFrame(
                animateRoll
            );
    }

    private easeOutCubic(
        value: number
    ): number {
        return 1 -
            Math.pow(
                1 - value,
                3
            );
    }

    private render(): void {
        this.resizeRenderer();

        // A resize can happen during a roll or while the result is displayed.
        if (this.diceGroup) {
            const visible = this.getVisibleSizeAtZ(this.diceGroup.position.z);
            const margin = this.diceRadius + 0.2;
            const maxX = Math.max(0, visible.width / 2 - margin);
            const maxY = Math.max(0, visible.height / 2 - margin);
            this.diceGroup.position.x = MathUtils.clamp(this.diceGroup.position.x, -maxX, maxX);
            this.diceGroup.position.y = MathUtils.clamp(this.diceGroup.position.y, -maxY, maxY);
        }

        this.renderer.render(
            this.scene,
            this.camera
        );

        this.animationFrame =
            requestAnimationFrame(() => {
                this.render();
            });
    }

    /**
     * Returns the camera-visible world-space width and height at
     * a particular Z coordinate.
     */
    private getVisibleSizeAtZ(
        z: number
    ): {
        width: number;
        height: number;
    } {
        const cameraZ =
            this.camera.position.z;

        const distance =
            Math.abs(cameraZ - z);

        const verticalFov =
            MathUtils.degToRad(
                this.camera.fov
            );

        const height =
            2 *
            Math.tan(
                verticalFov / 2
            ) *
            distance;

        const width =
            height *
            this.camera.aspect;

        return {
            width,
            height,
        };
    }

    /**
     * Frees geometries, materials, and textures when changing die.
     */
    private disposeObject(
        object: Object3D
    ): void {
        object.traverse(child => {
            if (!(child instanceof Mesh)) {
                return;
            }

            child.geometry.dispose();

            const materials =
                Array.isArray(
                    child.material
                )
                    ? child.material
                    : [child.material];

            for (
                const material of
                materials
                ) {
                const materialWithMap =
                    material as
                        | MeshBasicMaterial
                        | MeshStandardMaterial;

                if (
                    materialWithMap.map
                    instanceof Texture
                ) {
                    materialWithMap.map
                        .dispose();
                }

                material.dispose();
            }
        });
    }
}
