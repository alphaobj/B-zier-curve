document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const image = document.querySelector('.moving-image');
    const coordinateDisplay = document.querySelector('#coordinate');
    const canvas = document.querySelector('#pathCanvas');
    const ctx = canvas.getContext('2d');

    // 初始化坐标
    const startX = 50;
    const startY = 300;
    const endX = 550;
    const endY = 300;
    const control1X = Math.random() * container.clientWidth;
    const control1Y = Math.random() * container.clientHeight;
    const control2X = Math.random() * container.clientWidth;
    const control2Y = Math.random() * container.clientHeight;

    // 计算贝塞尔曲线点
    function cubicBezier(t, p0, p1, p2, p3) {
        const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;

        const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

        return { x, y };
    }

    // 绘制贝塞尔曲线及其轨迹
    function drawBezierCurve() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // 清除 canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制贝塞尔曲线
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, endX, endY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.stroke();

        // 绘制轨迹填充
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let t = 0; t <= 1; t += 0.01) {
            const { x, y } = cubicBezier(t, { x: startX, y: startY }, { x: control1X, y: control1Y }, { x: control2X, y: control2Y }, { x: endX, y: endY });
            ctx.lineTo(x, y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.7)'; // 轨迹颜色和透明度
        ctx.stroke();
    }

    // 绘制控制点及其坐标
    function drawControlPoints() {
        const points = [
            { x: startX, y: startY, label: 'Start' },
            { x: endX, y: endY, label: 'End' },
            { x: control1X, y: control1Y, label: 'Control 1' },
            { x: control2X, y: control2Y, label: 'Control 2' },
        ];

        points.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(`${point.label} (${Math.round(point.x)}, ${Math.round(point.y)})`, point.x + 10, point.y - 10);
        });
    }

    // 更新坐标显示
    function updateCoordinateDisplay(x, y) {
        coordinateDisplay.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
        coordinateDisplay.style.transform = `translate(${x}px, ${y}px)`;
    }

    // 动画
    const duration = 5000; // 动画持续时间 5000ms
    let startTime = null;

    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1); // 确保进度最大为 1

        const t = progress; // 贝塞尔曲线计算的参数

        const position = cubicBezier(t, { x: startX, y: startY }, { x: control1X, y: control1Y }, { x: control2X, y: control2Y }, { x: endX, y: endY });

        image.style.transform = `translate(${position.x}px, ${position.y}px)`;
        updateCoordinateDisplay(position.x, position.y);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // 动画完成后重新开始
            startTime = null;
            requestAnimationFrame(animate);
        }
    }

    // 绘制贝塞尔曲线和控制点
    drawBezierCurve();
    drawControlPoints();
    requestAnimationFrame(animate);
});
