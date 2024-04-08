
import puppeteer from 'puppeteer';

async function profile(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Network Latency
    const networkMetrics = await page.evaluate(() => {
        const resources = window.performance.getEntriesByType('resource');
        const latency = resources.reduce((total, resource) => total + resource.responseEnd - resource.requestStart, 0);
        return {
            networkLatency: latency.toFixed(2) + 'ms'
        };
    });

    // Rendering Time
    const renderingTime = await page.evaluate(() => {
        return {
            renderingTime: (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart).toFixed(2) + 'ms'
        };
    });

    // JavaScript Execution Speed
    const jsExecutionTime = await page.evaluate(() => {
        return {
            jsExecutionTime: (window.performance.timing.domComplete - window.performance.timing.domContentLoadedEventEnd).toFixed(2) + 'ms'
        };
    });

    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );

    await browser.close();

    // Convert timestamps to human-readable time
    const convertToTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    };

    const performanceMetrics = {
        ...networkMetrics,
        ...renderingTime,
        ...jsExecutionTime,
        connectStart: convertToTime(performanceTiming.connectStart),
        navigationStart: convertToTime(performanceTiming.navigationStart),
        fetchStart: convertToTime(performanceTiming.fetchStart),
        domContentLoadedEventStart: convertToTime(performanceTiming.domContentLoadedEventStart),
        responseStart: convertToTime(performanceTiming.responseStart),
        domInteractive: convertToTime(performanceTiming.domInteractive),
        domainLookupEnd: convertToTime(performanceTiming.domainLookupEnd),
        responseEnd: convertToTime(performanceTiming.responseEnd),
        requestStart: convertToTime(performanceTiming.requestStart),
        domLoading: convertToTime(performanceTiming.domLoading),
        domComplete: convertToTime(performanceTiming.domComplete),
        domainLookupStart: convertToTime(performanceTiming.domainLookupStart),
        loadEventStart: convertToTime(performanceTiming.loadEventStart),
        domContentLoadedEventEnd: convertToTime(performanceTiming.domContentLoadedEventEnd),
        loadEventEnd: convertToTime(performanceTiming.loadEventEnd),
        connectEnd: convertToTime(performanceTiming.connectEnd)
    };

    return performanceMetrics;
}

export default profile;

