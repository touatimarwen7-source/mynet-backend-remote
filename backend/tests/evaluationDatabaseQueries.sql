-- Offer Opening & Evaluation Testing Database Queries

-- 1. Check if opening_reports table exists
\d+ opening_reports;

-- 2. View offers with scores
SELECT 
  offer_number,
  technical_score,
  financial_score,
  final_score,
  ranking,
  technical_evaluated_at,
  financial_evaluated_at,
  evaluation_completed_at
FROM offers
WHERE technical_score IS NOT NULL OR financial_score IS NOT NULL
ORDER BY final_score DESC NULLS LAST
LIMIT 20;

-- 3. Check opening reports
SELECT 
  id,
  tender_id,
  total_offers_received,
  total_valid_offers,
  total_invalid_offers,
  opened_by,
  created_at
FROM opening_reports
ORDER BY created_at DESC
LIMIT 10;

-- 4. Verify final score calculation formula
SELECT 
  offer_number,
  technical_score,
  financial_score,
  final_score,
  (technical_score + financial_score) / 2 as calculated_score,
  CASE 
    WHEN ABS(final_score - ((technical_score + financial_score) / 2)) < 0.01 THEN 'CORRECT'
    ELSE 'ERROR'
  END as formula_check
FROM offers
WHERE technical_score IS NOT NULL AND financial_score IS NOT NULL
ORDER BY final_score DESC
LIMIT 15;

-- 5. Check ranking accuracy
SELECT 
  ranking,
  offer_number,
  final_score,
  LAG(final_score) OVER (ORDER BY ranking) as previous_rank_score
FROM offers
WHERE ranking IS NOT NULL
ORDER BY ranking ASC;

-- 6. View evaluation comments
SELECT 
  offer_number,
  technical_comments,
  financial_comments,
  technical_evaluated_by,
  financial_evaluated_by
FROM offers
WHERE technical_comments IS NOT NULL OR financial_comments IS NOT NULL
LIMIT 10;

-- 7. Check evaluation timeline
SELECT 
  offer_number,
  submitted_at,
  technical_evaluated_at,
  financial_evaluated_at,
  evaluation_completed_at,
  EXTRACT(EPOCH FROM (evaluation_completed_at - submitted_at)) as total_evaluation_time_seconds
FROM offers
WHERE evaluation_completed_at IS NOT NULL
ORDER BY evaluation_completed_at DESC
LIMIT 10;

-- 8. Verify decryption success rate
SELECT 
  COUNT(*) as total_offers,
  SUM(CASE WHEN was_encrypted THEN 1 ELSE 0 END) as encrypted_offers,
  SUM(CASE WHEN was_encrypted AND decryption_failed THEN 1 ELSE 0 END) as decryption_failures
FROM offers;

-- 9. Opening report data summary
SELECT 
  r.tender_id,
  t.tender_number,
  r.total_offers_received,
  r.total_valid_offers,
  r.total_invalid_offers,
  r.offers_data
FROM opening_reports r
LEFT JOIN tenders t ON r.tender_id = t.id
ORDER BY r.created_at DESC
LIMIT 10;

-- 10. Performance: Evaluation completion time
SELECT 
  AVG(EXTRACT(EPOCH FROM (evaluation_completed_at - submitted_at))) as avg_evaluation_time_seconds,
  MIN(EXTRACT(EPOCH FROM (evaluation_completed_at - submitted_at))) as min_time,
  MAX(EXTRACT(EPOCH FROM (evaluation_completed_at - submitted_at))) as max_time
FROM offers
WHERE evaluation_completed_at IS NOT NULL;

