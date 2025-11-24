/**
 * 💾 Memory Profiling Script
 * Analyzes heap usage and garbage collection
 */

const fs = require('fs');
const v8 = require('v8');

const SAMPLES = [];
const INTERVAL = 500; // Sample every 500ms
const DURATION = 30000; // Run for 30 seconds

console.log('💾 MEMORY PROFILING STARTED\n');
console.log('Sampling memory usage every 500ms for 30 seconds...\n');

const baseline = process.memoryUsage();

const sampleMemory = () => {
  const current = process.memoryUsage();
  SAMPLES.push({
    timestamp: Date.now(),
    heapUsed: Math.round(current.heapUsed / 1024 / 1024),
    heapTotal: Math.round(current.heapTotal / 1024 / 1024),
    external: Math.round(current.external / 1024 / 1024),
    rss: Math.round(current.rss / 1024 / 1024),
    heapChange: Math.round((current.heapUsed - baseline.heapUsed) / 1024 / 1024)
  });
};

// Sample memory periodically
const sampleInterval = setInterval(sampleMemory, INTERVAL);

// Stop after duration
setTimeout(() => {
  clearInterval(sampleInterval);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                  💾 MEMORY PROFILE RESULTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Calculate statistics
  const heapUsed = SAMPLES.map(s => s.heapUsed);
  const heapChange = SAMPLES.map(s => s.heapChange);

  const avgHeap = Math.round(heapUsed.reduce((a, b) => a + b, 0) / heapUsed.length);
  const minHeap = Math.min(...heapUsed);
  const maxHeap = Math.max(...heapUsed);
  const finalHeap = heapUsed[heapUsed.length - 1];

  const avgChange = Math.round(heapChange.reduce((a, b) => a + b, 0) / heapChange.length);
  const maxChange = Math.max(...heapChange);
  const minChange = Math.min(...heapChange);

  console.log('📊 HEAP USAGE STATISTICS:');
  console.log(`  Initial: ${Math.round(baseline.heapUsed / 1024 / 1024)}MB`);
  console.log(`  Final: ${finalHeap}MB`);
  console.log(`  Average: ${avgHeap}MB`);
  console.log(`  Min: ${minHeap}MB`);
  console.log(`  Max: ${maxHeap}MB`);
  console.log(`  Fluctuation: ${maxHeap - minHeap}MB\n`);

  console.log('📈 MEMORY CHANGE FROM BASELINE:');
  console.log(`  Average Change: ${avgChange}MB`);
  console.log(`  Max Increase: ${maxChange}MB`);
  console.log(`  Min Change: ${minChange}MB\n`);

  console.log('🔍 HEAP STATISTICS (V8):');
  try {
    const heapStats = v8.getHeapStatistics();
    console.log(`  Total Heap Size: ${Math.round(heapStats.total_heap_size / 1024 / 1024)}MB`);
    console.log(`  Executable Size: ${Math.round(heapStats.total_heap_size_executable / 1024 / 1024)}MB`);
    console.log(`  Heap Limit: ${Math.round(heapStats.heap_size_limit / 1024 / 1024)}MB`);
  } catch (e) {
    console.log(`  V8 stats not available: ${e.message}`);
  }

  console.log('\n📋 MEMORY TREND (Sample Every 500ms):');
  SAMPLES.slice(0, 10).forEach((sample, idx) => {
    console.log(`  ${idx}: ${sample.heapUsed}MB (${sample.heapChange >= 0 ? '+' : ''}${sample.heapChange}MB)`);
  });
  console.log('  ...');
  SAMPLES.slice(-5).forEach((sample, idx) => {
    console.log(`  ${SAMPLES.length - 5 + idx}: ${sample.heapUsed}MB (${sample.heapChange >= 0 ? '+' : ''}${sample.heapChange}MB)`);
  });

  console.log('\n✅ MEMORY HEALTH CHECK:');
  if (maxHeap < 100 && maxChange < 50) {
    console.log('  🟢 EXCELLENT - Memory usage stable and low');
  } else if (maxHeap < 200 && maxChange < 100) {
    console.log('  🟡 GOOD - Memory usage acceptable');
  } else {
    console.log('  🔴 WARNING - High memory usage detected');
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n');

  process.exit(0);
}, DURATION);
