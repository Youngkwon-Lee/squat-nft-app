import { useEffect, useRef, useState } from 'react';
import * as posenet from '@tensorflow-models/posenet';

interface Props {
  onSquatComplete: () => void;
}

const SquatDetector: React.FC<Props> = ({ onSquatComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [net, setNet] = useState<posenet.PoseNet | null>(null);
  const [isSquatting, setIsSquatting] = useState(false);
  const [viewMode, setViewMode] = useState<'front' | 'side'>('front');
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const previousHipYRef = useRef<number>(0);
  const previousKneeAngleRef = useRef<number>(0);

  // 각도 계산 함수
  const calculateAngle = (p1: posenet.Keypoint, p2: posenet.Keypoint, p3: posenet.Keypoint) => {
    const radians = Math.atan2(p3.position.y - p2.position.y, p3.position.x - p2.position.x) -
                   Math.atan2(p1.position.y - p2.position.y, p1.position.x - p2.position.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  // 스쿼트 감지 함수
  const detectSquat = async (pose: posenet.Pose) => {
    const hipY = pose.keypoints[11].position.y; // 왼쪽 엉덩이

    if (viewMode === 'front') {
      // 정면 모드: 엉덩이 위치 변화로 판단
      const hipDiff = hipY - previousHipYRef.current;
      
      if (!isSquatting && hipDiff > 30) {
        setIsSquatting(true);
      } else if (isSquatting && hipDiff < -30) {
        setIsSquatting(false);
        onSquatComplete();
      }
      
      previousHipYRef.current = hipY;
    } else {
      // 측면 모드: 무릎 각도로 판단
      const kneeAngle = calculateAngle(
        pose.keypoints[11], // 엉덩이
        pose.keypoints[13], // 무릎
        pose.keypoints[15]  // 발목
      );

      if (!isSquatting && kneeAngle < 100) {
        setIsSquatting(true);
      } else if (isSquatting && kneeAngle > 160) {
        setIsSquatting(false);
        onSquatComplete();
      }

      previousKneeAngleRef.current = kneeAngle;
    }
  };

  // 포즈 추정 및 시각화
  const detectPose = async () => {
    if (!net || !videoRef.current || !canvasRef.current) return;

    const pose = await net.estimateSinglePose(videoRef.current);
    if (pose.score > 0.3) {
      detectSquat(pose);
      drawPose(pose);
    }

    requestRef.current = requestAnimationFrame(detectPose);
  };

  // 포즈 시각화
  const drawPose = (pose: posenet.Pose) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !videoRef.current) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(videoRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // 키포인트 그리기
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = isSquatting ? '#00F5A0' : '#9B51E0';
        ctx.fill();
      }
    });
  };

  // 컴포넌트 초기화
  useEffect(() => {
    const setupCamera = async () => {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        await new Promise(resolve => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });

        if (canvasRef.current) {
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
        }
      } catch {
        setError('웹캠을 찾을 수 없습니다. 웹캠을 연결하고 페이지를 새로고침해주세요.');
      }
    };

    const loadPoseNet = async () => {
      try {
        const loadedNet = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75,
        });
        setNet(loadedNet);
      } catch {
        setError('PoseNet 모델을 로드하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    setupCamera();
    loadPoseNet();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (net && !error) {
      detectPose();
    }
  }, [net, error]);

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <button
          onClick={() => onSquatComplete()}
          className="btn-primary"
        >
          테스트 모드: 스쿼트 완료
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="rounded-xl"
      />
      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => setViewMode('front')}
          className={`px-4 py-2 rounded ${
            viewMode === 'front'
              ? 'bg-primary text-dark'
              : 'bg-dark-light text-gray-300'
          }`}
        >
          정면
        </button>
        <button
          onClick={() => setViewMode('side')}
          className={`px-4 py-2 rounded ${
            viewMode === 'side'
              ? 'bg-primary text-dark'
              : 'bg-dark-light text-gray-300'
          }`}
        >
          측면
        </button>
      </div>
      <div className="absolute bottom-4 left-4 px-4 py-2 rounded bg-dark-light/80">
        <p className="text-lg">
          {isSquatting ? '스쿼트 중...' : '스쿼트 대기 중'}
        </p>
      </div>
    </div>
  );
};

export default SquatDetector; 