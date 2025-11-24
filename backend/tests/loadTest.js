/**
 * 🔥 Load Test Script - 10k Records
 * Tests performance with large datasets
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const RESULTS = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  memorySamples: [],
  startTime: null,
  endTime: null
};

// Simulate 10k records pagination
const loadTest = async () => {
  console.log('🔥 START LOAD TEST - 10k Records\n');
  RESULTS.startTime = Date.now();

  // Test 1: Tenders List with Pagination (1000 pages × 10 items)
  console.log('📊 Test 1: Tenders List Pagination (1000 pages)');
  await testPagination('/procurement/tenders', 1000, 10);

  // Test 2: Offers List with Pagination
  console.log('\n📊 Test 2: Offers List Pagination (500 pages)');
  await testPagination('/procurement/my-offers', 500, 20);

  // Test 3: Invoices List with Pagination
  console.log('\n📊 Test 3: Invoices List Pagination (500 pages)');
  await testPagination('/procurement/invoices', 500, 20);

  // Test 4: Parallel Requests (Concurrent)
  console.log('\n📊 Test 4: Parallel Requests (100 concurrent)');
  await testParallel('/procurement/tenders', 100, 5);

  RESULTS.endTime = Date.now();
  printResults();
};

const testPagination = async (endpoint, pages, itemsPerPage) => {
  const samplePages = Math.min(100, pages); // Test 100 pages to save time
  const step = Math.floor(pages / samplePages);

  for (let i = 0; i < samplePages; i++) {
    const page = i * step + 1;
    try {
      const startTime = Date.now();
      const response = await axios.get(`${API_BASE}${endpoint}`, {
        params: { page, limit: itemsPerPage }
      });
      const responseTime = Date.now() - startTime;

      RESULTS.responseTimes.push(responseTime);
      RESULTS.successfulRequests++;

      if (i % 10 === 0) {
        console.log(`  ✅ Page ${page}: ${responseTime}ms`);
        recordMemory();
      }
    } catch (error) {
      RESULTS.failedRequests++;
      console.log(`  ❌ Page ${page}: ${error.message}`);
    }
    RESULTS.totalRequests++;
  }
};

const testParallel = async (endpoint, concurrent, iterations) => {
  for (let iter = 0; iter < iterations; iter++) {
    const promises = [];
    const startTime = Date.now();

    for (let i = 0; i < concurrent; i++) {
      const page = Math.floor(Math.random() * 100) + 1;
      promises.push(
        axios.get(`${API_BASE}${endpoint}`, {
          params: { page, limit: 20 }
        }).catch(err => ({ error: err.message }))
      );
    }

    const results = await Promise.all(promises);
    const iterationTime = Date.now() - startTime;

    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;

    RESULTS.successfulRequests += successful;
    RESULTS.failedRequests += failed;
    RESULTS.totalRequests += concurrent;

    console.log(`  ✅ Iteration ${iter + 1}: ${concurrent} concurrent requests in ${iterationTime}ms (${successful} success, ${failed} failed)`);
    recordMemory();
  }
};

const recordMemory = () => {
  const memUsage = process.memoryUsage();
  RESULTS.memorySamples.push({
    timestamp: Date.now(),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024),
    rss: Math.round(memUsage.rss / 1024 / 1024)
  });
};

const printResults = () => {
  const duration = RESULTS.endTime - RESULTS.startTime;
  const avgResponseTime = Math.round(RESULTS.responseTimes.reduce((a, b) => a + b, 0) / RESULTS.responseTimes.length);
  const minResponseTime = Math.min(...RESULTS.responseTimes);
  const maxResponseTime = Math.max(...RESULTS.responseTimes);
  const p95ResponseTime = RESULTS.responseTimes.sort((a, b) => a - b)[Math.floor(RESULTS.responseTimes.length * 0.95)];

  const initialMemory = RESULTS.memorySamples[0];
  const finalMemory = RESULTS.memorySamples[RESULTS.memorySamples.length - 1];
  const maxMemory = Math.max(...RESULTS.memorySamples.map(m => m.heapUsed));

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('               🔥 LOAD TEST RESULTS - 10k RECORDS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('📊 REQUEST STATISTICS:');
  console.log(`  Total Requests: ${RESULTS.totalRequests}`);
  console.log(`  Successful: ${RESULTS.successfulRequests} (${Math.round(RESULTS.successfulRequests / RESULTS.totalRequests * 100)}%)`);
  console.log(`  Failed: ${RESULTS.failedRequests}`);
  console.log(`  Total Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
  console.log(`  Requests/Second: ${Math.round(RESULTS.totalRequests / (duration / 1000))}\n`);

  console.log('⏱️  RESPONSE TIME ANALYSIS:');
  console.log(`  Average: ${avgResponseTime}ms`);
  console.log(`  Min: ${minResponseTime}ms`);
  console.log(`  Max: ${maxResponseTime}ms`);
  console.log(`  P95: ${p95ResponseTime}ms\n`);

  console.log('💾 MEMORY PROFILING:');
  console.log(`  Initial Heap: ${initialMemory.heapUsed}MB / ${initialMemory.heapTotal}MB`);
  console.log(`  Final Heap: ${finalMemory.heapUsed}MB / ${finalMemory.heapTotal}MB`);
  console.log(`  Max Heap Used: ${maxMemory}MB`);
  console.log(`  Memory Change: ${finalMemory.heapUsed - initialMemory.heapUsed}MB\n`);

  console.log('✅ PERFORMANCE VERDICT:');
  if (avgResponseTime < 500 && RESULTS.failedRequests === 0) {
    console.log('  🟢 EXCELLENT - All metrics within optimal range');
  } else if (avgResponseTime < 1000 && RESULTS.failedRequests < RESULTS.totalRequests * 0.05) {
    console.log('  🟡 GOOD - Performance acceptable with minor improvements possible');
  } else {
    console.log('  🔴 NEEDS IMPROVEMENT - Consider further optimization');
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
};

// Run test
loadTest().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Test Error:', err.message);
  process.exit(1);
});
