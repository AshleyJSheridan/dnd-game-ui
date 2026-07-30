import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    MeshStandardMaterial,
    IcosahedronGeometry,
    AmbientLight,
    DirectionalLight,
    MathUtils,
    Group,
    Vector3,
    BufferGeometry,
    CanvasTexture,
    SRGBColorSpace,
    Quaternion,
    MeshBasicMaterial,
    DoubleSide,
    PlaneGeometry,
} from 'three';

@Component({
    selector: 'app-rolled-dice',
    standalone: true,
    imports: [],
    templateUrl: './rolled-dice.component.html',
})
export class RolledDiceComponent implements AfterViewInit, OnDestroy {
    private renderer!: WebGLRenderer;
    private scene!: Scene;
    private camera!: PerspectiveCamera;
    private animationFrame: number | null = null;
    public result: number | null = null;
    public rolling = false;
    private diceGroup!: Group;
    private diceMesh!: Mesh;
    public showDice: boolean = false;
    private timeoutId: number | null = null;

    private readonly faces: {
        number: number;
        normal: Vector3;
        centre: Vector3;
        up: Vector3;
    }[] = [];

    @ViewChild('diceCanvas', { static: true })
    private canvasRef!: ElementRef<HTMLCanvasElement>;

    ngAfterViewInit(): void {
        this.initScene();
        this.render();
    }

    ngOnDestroy(): void {
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
        }

        this.renderer?.dispose();
    }

    private initScene(): void {
        const canvas = this.canvasRef.nativeElement;

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100
        );

        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setSize(
            canvas.clientWidth,
            canvas.clientHeight,
            false
        );

        this.createDice();

        const ambientLight = new AmbientLight(0xff0000, 2);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 4);
        directionalLight.position.set(4, 5, 5);

        this.scene.add(directionalLight);
    }

    private createDice(): void {
        this.diceGroup = new Group();

        this.diceGroup.scale.setScalar(.25)

        /*
         * detail must remain 0 so that the geometry has exactly 20 faces.
         */
        const geometry = new IcosahedronGeometry(1.5, 0);

        /*
         * Ensure each triangle has its own three vertices.
         */
        const faceGeometry = geometry.index
            ? geometry.toNonIndexed()
            : geometry;

        const material = new MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.35,
            metalness: 0.15,
            flatShading: true,
        });

        this.diceMesh = new Mesh(faceGeometry, material);
        this.diceGroup.add(this.diceMesh);

        this.createFaceNumbers(faceGeometry);

        this.scene.add(this.diceGroup);
    }

    private createFaceNumbers(geometry: BufferGeometry): void {
        const positions = geometry.getAttribute('position');

        /*
         * A non-indexed triangle uses three consecutive vertices.
         */
        for (
            let vertexIndex = 0, faceIndex = 0;
            vertexIndex < positions.count;
            vertexIndex += 3, faceIndex++
        ) {
            const a = new Vector3().fromBufferAttribute(
                positions,
                vertexIndex
            );

            const b = new Vector3().fromBufferAttribute(
                positions,
                vertexIndex + 1
            );

            const c = new Vector3().fromBufferAttribute(
                positions,
                vertexIndex + 2
            );

            const centre = new Vector3()
                .addVectors(a, b)
                .add(c)
                .divideScalar(3);

            const normal = new Vector3()
                .subVectors(b, a)
                .cross(new Vector3().subVectors(c, a))
                .normalize();

            const edgeMidpoint = new Vector3()
                .addVectors(a, b)
                .multiplyScalar(0.5);

            const faceUp = c.clone()
                .sub(edgeMidpoint)
                .normalize();

            /*
             * Ensure the normal points away from the centre of the die.
             */
            if (normal.dot(centre) < 0) {
                normal.negate();
            }

            const number = faceIndex + 1;

            this.faces.push({
                number,
                normal: normal.clone(),
                centre: centre.clone(),
                up: faceUp.clone(),
            });

            const numberMesh = this.createNumberMesh(number, normal);

            numberMesh.position.copy(centre.clone().addScaledVector(normal, 0.015));

            this.diceGroup.add(numberMesh);
        }
    }

    private createNumberMesh(number: number, faceNormal: Vector3): Mesh {
        const canvas = document.createElement('canvas');

        canvas.width = 256;
        canvas.height = 256;

        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Could not create number canvas context.');
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#ffffff';
        context.font = 'bold 180px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText(
            number.toString(),
            canvas.width / 2,
            canvas.height / 2
        );

        const texture = new CanvasTexture(canvas);

        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;

        const material = new MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            side: DoubleSide,
        });

        const geometry = new PlaneGeometry(0.6, 0.6);

        const mesh = new Mesh(geometry, material);

        /*
         * PlaneGeometry initially faces along its local positive Z axis.
         * Rotate it so that positive Z points in the same direction as
         * the dice face normal.
         */
        mesh.quaternion.setFromUnitVectors(
            new Vector3(0, 0, 1),
            faceNormal.clone().normalize()
        );

        return mesh;
    }

    public roll(rollValue: number): void {
        if (this.rolling) {
            return;
        }

        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.rolling = true;
        this.showDice = true;
        if (this.timeoutId === null) {
            this.timeoutId = window.setTimeout(() => {
                this.showDice = false;
                this.timeoutId = null;
            }, 5000);
        }
        this.result = rollValue;

        const face = this.faces.find(currentFace => currentFace.number === this.result);

        if (!face) {
            this.rolling = false;

            throw new Error(`No D20 face found for number ${this.result}.`);
        }

        /*
         * Reset the die to the beginning of its movement.
         */
        const visible = this.getVisibleSizeAtZ(0);

        const diceRadius = 1.5 * 0.7; // geometry radius × diceGroup scale
        const padding = 0.2;

        const maxX = visible.width / 2 - diceRadius - padding;
        const maxY = visible.height / 2 - diceRadius - padding;

        const startPosition = new Vector3(-maxX, MathUtils.randFloat(-maxY, maxY), 0);
        const endPosition = new Vector3(maxX, MathUtils.randFloat(-maxY, maxY), 0);

        this.diceGroup.position.copy(startPosition);

        /*
         * Work out the direction from the die towards the camera.
         */
        const cameraPosition = new Vector3();
        this.camera.getWorldPosition(cameraPosition);

        const cameraDirection = cameraPosition
            .sub(endPosition)
            .normalize();

        /*
         * Rotate the selected face so it points towards the camera.
         */
        const landingQuaternion = new Quaternion()
            .setFromUnitVectors(
                face.normal.clone().normalize(),
                cameraDirection
            );

        /*
         * Keep the number upright relative to the screen.
         */
        const rotatedFaceUp = face.up
            .clone()
            .applyQuaternion(landingQuaternion);

        const desiredUp = this.camera.up
            .clone()
            .applyQuaternion(this.camera.quaternion)
            .projectOnPlane(cameraDirection)
            .normalize();

        const currentUp = rotatedFaceUp
            .projectOnPlane(cameraDirection)
            .normalize();

        let twistAngle = currentUp.angleTo(desiredUp);

        const cross = new Vector3()
            .crossVectors(currentUp, desiredUp);

        if (cross.dot(cameraDirection) < 0) {
            twistAngle = -twistAngle;
        }

        const twistQuaternion = new Quaternion()
            .setFromAxisAngle(
                cameraDirection,
                twistAngle
            );

        landingQuaternion.premultiply(twistQuaternion);

        /*
         * Random tumbling axis.
         */
        const angularAxis = new Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        );

        if (angularAxis.lengthSq() === 0) {
            angularAxis.set(1, 1, 1);
        }

        angularAxis.normalize();

        const startTime = performance.now();
        let previousTime = startTime;

        const duration = 1800;

        const animateRoll = (time: number): void => {
            const elapsed = time - startTime;

            const deltaSeconds = Math.min(
                (time - previousTime) / 1000,
                0.05
            );

            previousTime = time;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            /*
             * Move the die from its start position to its end position.
             */
            const movementProgress = this.easeOutCubic(progress);

            this.diceGroup.position.lerpVectors(
                startPosition,
                endPosition,
                movementProgress
            );

            /*
             * Add a small vertical bounce while it moves.
             *
             * The bounce fades out as the die reaches the end.
             */
            const bounceHeight = 0.35;
            const bounceCount = 4;

            this.diceGroup.position.y =
                Math.abs(
                    Math.sin(progress * Math.PI * bounceCount)
                ) *
                bounceHeight *
                (1 - progress);

            /*
             * Spin quickly at first and gradually slow down.
             */
            const spinSpeed = MathUtils.lerp(
                22,
                0,
                this.easeOutCubic(progress)
            );

            const incrementalRotation = new Quaternion()
                .setFromAxisAngle(
                    angularAxis,
                    spinSpeed * deltaSeconds
                );

            this.diceGroup.quaternion.multiply(
                incrementalRotation
            );

            /*
             * Gradually steer towards the selected face.
             */
            const steeringStart = 0.35;

            if (progress > steeringStart) {
                const steeringProgress =
                    (progress - steeringStart) /
                    (1 - steeringStart);

                const steeringStrength = MathUtils.lerp(
                    0.01,
                    0.35,
                    this.easeOutCubic(steeringProgress)
                );

                this.diceGroup.quaternion.slerp(
                    landingQuaternion,
                    steeringStrength
                );
            }

            if (progress < 1) {
                requestAnimationFrame(animateRoll);
                return;
            }

            this.diceGroup.quaternion.copy(landingQuaternion);
            this.rolling = false;
        };

        requestAnimationFrame(animateRoll);
    }

    private easeOutQuad(value: number): number {
        return 1 - (1 - value) * (1 - value);
    }

    private easeOutCubic(value: number): number {
        return 1 - Math.pow(1 - value, 3);
    }

    private showFace(number: number): void {
        const face = this.faces.find(
            currentFace => currentFace.number === number
        );

        if (!face) {
            throw new Error(`No D20 face found for number ${number}.`);
        }

        const upward = new Vector3(0, 1, 0);

        /*
         * Rotate the selected face's outward normal onto world-space up.
         */
        const targetQuaternion = new Quaternion()
            .setFromUnitVectors(
                face.normal.clone().normalize(),
                upward
            );

        /*
         * Randomise the final rotation around the vertical axis without
         * changing which face is on top.
         */
        const verticalRotation = new Quaternion()
            .setFromAxisAngle(
                upward,
                Math.random() * Math.PI * 2
            );

        targetQuaternion.premultiply(verticalRotation);

        this.animateToQuaternion(targetQuaternion);
    }

    private animateToQuaternion(targetQuaternion: Quaternion): void {
        const startQuaternion = this.diceGroup.quaternion.clone();

        const startTime = performance.now();
        const duration = 500;

        const animate = (time: number): void => {
            const progress = Math.min(
                (time - startTime) / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            this.diceGroup.quaternion.slerpQuaternions(
                startQuaternion,
                targetQuaternion,
                easedProgress
            );

            if (progress < 1) {
                requestAnimationFrame(animate);
                return;
            }

            this.diceGroup.quaternion.copy(targetQuaternion);
            this.rolling = false;
        };

        requestAnimationFrame(animate);
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);

        this.animationFrame = requestAnimationFrame(() => {
            this.render();
        });
    }

    private getVisibleSizeAtZ(z: number): {
        width: number;
        height: number;
    } {
        const cameraZ = this.camera.position.z;
        const distance = Math.abs(cameraZ - z);

        const verticalFov = MathUtils.degToRad(
            this.camera.fov
        );

        const height =
            2 * Math.tan(verticalFov / 2) * distance;

        const width = height * this.camera.aspect;

        return {
            width,
            height
        };
    }
}
