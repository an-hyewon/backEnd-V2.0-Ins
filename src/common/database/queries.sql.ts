export const queries = {
  Old: {
    /* 설계내역 조회 */
    selectInsuratorPlanDliCntByPlannerIdOld: `
      SELECT COUNT(*) AS totalCount
            , COUNT(CASE WHEN a.plannerStatus = '조회/설계' THEN 1 END) AS premCmptCount
            , COUNT(CASE WHEN a.plannerStatus = '견적제출' THEN 1 END) AS sendCount
            , COUNT(CASE WHEN a.plannerStatus = '계약완료' THEN 1 END) AS joinCount
            , COUNT(CASE WHEN a.plannerStatus = '만기/임박' THEN 1 END) AS expireCount
      FROM  (
            SELECT  insured.id
                    , CASE WHEN insured.refer_idx IS NOT NULL THEN insured.refer_idx
                           ELSE ij.refer_id 
                           END AS referId
                    , insured.biz_type AS bizType
                    , insured.insured_biz_no AS insuredBizNo
                    , insured.insured_fran_nm AS insuredFranNm
                    , insured.insured_nm AS insuredNm
                    , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                           ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                           END AS address
                    , insured.join_day AS joinDay
                    , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
                    , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
                    , insured.join_ck AS joinCk
                    , insured.join_account AS joinAccount
                    , insured.join_path AS joinPath
                    , insured.created_dt AS createdDt
                    , insured.updated_dt AS updatedDt
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , ici.ins_com_cd AS insComCd
                    , insured.ins_com AS insCom
                    , ici.ins_com_full_nm AS insComFullNm
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                          WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                          ELSE NULL
                          END AS ctrtType
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , planner.user_eml AS plannerEmail
                    , ga.ga_nm AS plannerGa
                    , insured.created_dt AS sortDt
        --             , AS prem_cmpt_dt -- 조회/설계일
        --             , AS send_dt -- 견적제출일
        --             , AS join_dt -- 계약완료일
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN '만기/임박'
        --                    WHEN insured.join_ck = 'Y' THEN '계약완료'
        --                    WHEN tpef.send_yn = 'Y' THEN '견적제출'
        --                    ELSE '조회/설계' 
        --                    END AS planner_status
                      , ij.plan_stts_cd AS planStatusCd
                      , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                            WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                            WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                            ELSE '조회/설계' 
                            END AS plannerStatus
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN 1
        --                    WHEN insured.join_ck = 'Y' THEN 2
        --                    WHEN tpef.send_yn = 'Y' THEN 3
        --                    ELSE 4 
        --                    END AS orderNo
                    , ips.sort_no AS orderNo
                    , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                        CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                            ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                            END
                                                                        )
                                                                    , NOW())
                          ELSE NULL 
                          END AS insDday
                    , 'N' AS rejoinYn
            FROM tb_insured_dli_info insured  LEFT JOIN tb_meritz_dli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                              LEFT JOIN tb_kb_dli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM ins_prod
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                              AND ins_prod_cd = 'dli'
                                                        ) ipi ON ipi.strt_dt <= insured.created_dt
                                                                AND ipi.end_dt > insured.created_dt
                                              LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                              LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                       AND ipci.ins_com_id = ici.id
                                              LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                            AND ipt.strt_dt <= insured.created_dt
                                                                            AND ipt.end_dt > insured.created_dt
                                              LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                                  AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                              LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                              AND insured.insured_sno = kdmpc.obgt_ins_seq
                                              LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                              INNER JOIN  (
                                                          SELECT *
                                                          FROM insurator_join
                                                          WHERE 1=1
                                                                AND del_dt IS NULL
                                                                AND planner_id IN (%%plannerIds%%)
                                                          ) ij ON ij.ins_prod_com_id = ipci.id
                                                                  AND ij.join_id = insured.id
                                              LEFT JOIN insurator_planner planner ON planner.id = ij.planner_id
                                              LEFT JOIN insurator_ga ga ON ga.id = planner.ga_id
                                              LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                                            AND planner_fee.ins_prod_com_id = ipci.id
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM insurator_plan_stts
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                        ) ips on ips.plan_stts_cd = ij.plan_stts_cd
            WHERE 1=1
                  AND insured.deleted_dt IS NULL
                  AND insured.del_yn = 'N'
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanDliListByPlannerIdOld: `
      SELECT *
      FROM  (
            SELECT  insured.id
                    , CASE WHEN insured.refer_idx IS NOT NULL THEN insured.refer_idx
                           ELSE ij.refer_id 
                           END AS referId
                    , insured.biz_type AS bizType
                    , insured.insured_biz_no AS insuredBizNo
                    , insured.insured_fran_nm AS insuredFranNm
                    , insured.insured_nm AS insuredNm
                    , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                           ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                           END AS address
                    , insured.join_day AS joinDay
                    , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
                    , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
                    , insured.join_ck AS joinCk
                    , insured.join_account AS joinAccount
                    , insured.join_path AS joinPath
                    , insured.created_dt AS createdDt
                    , insured.updated_dt AS updatedDt
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , ici.ins_com_cd AS insComCd
                    , insured.ins_com AS insCom
                    , ici.ins_com_full_nm AS insComFullNm
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                          WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                          ELSE NULL
                          END AS ctrtType
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , planner.user_eml AS plannerEmail
                    , ga.ga_nm AS plannerGa
                    , insured.created_dt AS sortDt
        --             , AS prem_cmpt_dt -- 조회/설계일
        --             , AS send_dt -- 견적제출일
        --             , AS join_dt -- 계약완료일
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN '만기/임박'
        --                    WHEN insured.join_ck = 'Y' THEN '계약완료'
        --                    WHEN tpef.send_yn = 'Y' THEN '견적제출'
        --                    ELSE '조회/설계' 
        --                    END AS planner_status
                    , ij.plan_stts_cd AS planStatusCd
                    , CASE WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd = 'E' THEN '만기'
                           WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd IN ('N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN 1
        --                    WHEN insured.join_ck = 'Y' THEN 2
        --                    WHEN tpef.send_yn = 'Y' THEN 3
        --                    ELSE 4 
        --                    END AS orderNo
                    , ips.sort_no AS orderNo
                    , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                        CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                            ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                            END
                                                                        )
                                                                    , NOW())
                          ELSE NULL 
                          END AS insDday
                    , 'N' AS rejoinYn
            FROM tb_insured_dli_info insured  LEFT JOIN tb_meritz_dli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                              LEFT JOIN tb_kb_dli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM ins_prod
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                              AND ins_prod_cd = 'dli'
                                                        ) ipi ON ipi.strt_dt <= insured.created_dt
                                                                AND ipi.end_dt > insured.created_dt
                                              LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                              LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                       AND ipci.ins_com_id = ici.id
                                              LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                            AND ipt.strt_dt <= insured.created_dt
                                                                            AND ipt.end_dt > insured.created_dt
                                              LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                                  AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                              LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                              AND insured.insured_sno = kdmpc.obgt_ins_seq
                                              LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                              INNER JOIN  (
                                                          SELECT *
                                                          FROM insurator_join
                                                          WHERE 1=1
                                                                AND del_dt IS NULL
                                                                AND planner_id IN (%%plannerIds%%)
                                                          ) ij ON ij.ins_prod_com_id = ipci.id
                                                                  AND ij.join_id = insured.id
                                              LEFT JOIN insurator_planner planner ON planner.id = ij.planner_id
                                              LEFT JOIN insurator_ga ga ON ga.id = planner.ga_id
                                              LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                                            AND planner_fee.ins_prod_com_id = ipci.id
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM insurator_plan_stts
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                        ) ips on ips.plan_stts_cd = ij.plan_stts_cd
            WHERE 1=1
                  AND insured.deleted_dt IS NULL
                  AND insured.del_yn = 'N'
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanMfliCntByPlannerIdOld: `
      SELECT COUNT(*) AS totalCount
            , COUNT(CASE WHEN a.plannerStatus = '조회/설계' THEN 1 END) AS premCmptCount
            , COUNT(CASE WHEN a.plannerStatus = '견적제출' THEN 1 END) AS sendCount
            , COUNT(CASE WHEN a.plannerStatus = '계약완료' THEN 1 END) AS joinCount
            , COUNT(CASE WHEN a.plannerStatus = '만기/임박' THEN 1 END) AS expireCount
      FROM  (
            SELECT  insured.id
                    , CASE WHEN insured.refer_idx IS NOT NULL THEN insured.refer_idx
                           ELSE ij.refer_id 
                           END AS referId
                    , insured.biz_type AS bizType
                    , insured.insured_biz_no AS insuredBizNo
                    , insured.insured_fran_nm AS insuredFranNm
                    , insured.insured_nm AS insuredNm
                    , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                           ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                           END AS address
                    , insured.join_day AS joinDay
                    , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
                    , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
                    , insured.join_ck AS joinCk
                    , insured.join_account AS joinAccount
                    , insured.join_path AS joinPath
                    , insured.created_dt AS createdDt
                    , insured.updated_dt AS updatedDt
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , ici.ins_com_cd AS insComCd
                    , insured.ins_com AS insCom
                    , ici.ins_com_full_nm AS insComFullNm
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                          WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                          ELSE NULL
                          END AS ctrtType
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , planner.user_eml AS plannerEmail
                    , ga.ga_nm AS plannerGa
                    , insured.created_dt AS sortDt
        --             , AS prem_cmpt_dt -- 조회/설계일
        --             , AS send_dt -- 견적제출일
        --             , AS join_dt -- 계약완료일
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN '만기/임박'
        --                    WHEN insured.join_ck = 'Y' THEN '계약완료'
        --                    WHEN tpef.send_yn = 'Y' THEN '견적제출'
        --                    ELSE '조회/설계' 
        --                    END AS planner_status
                      , ij.plan_stts_cd AS planStatusCd
                      , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                            WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                            WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                            ELSE '조회/설계' 
                            END AS plannerStatus
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN 1
        --                    WHEN insured.join_ck = 'Y' THEN 2
        --                    WHEN tpef.send_yn = 'Y' THEN 3
        --                    ELSE 4 
        --                    END AS orderNo
                    , ips.sort_no AS orderNo
                    , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                        CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                            ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                            END
                                                                        )
                                                                    , NOW())
                          ELSE NULL 
                          END AS insDday
                    , 'N' AS rejoinYn
            FROM tb_insured_mfli_info insured LEFT JOIN tb_meritz_mfli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                              LEFT JOIN tb_kb_mfli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM ins_prod
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                              AND ins_prod_cd = 'mfli'
                                                        ) ipi ON ipi.strt_dt <= insured.created_dt
                                                                AND ipi.end_dt > insured.created_dt
                                              LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                              LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                       AND ipci.ins_com_id = ici.id
                                              LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                            AND ipt.strt_dt <= insured.created_dt
                                                                            AND ipt.end_dt > insured.created_dt
                                              LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                                  AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                              LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                              AND insured.insured_sno = kdmpc.obgt_ins_seq
                                              LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                              INNER JOIN  (
                                                          SELECT *
                                                          FROM insurator_join
                                                          WHERE 1=1
                                                                AND del_dt IS NULL
                                                                AND planner_id IN (%%plannerIds%%)
                                                          ) ij ON ij.ins_prod_com_id = ipci.id
                                                                  AND ij.join_id = insured.id
                                              LEFT JOIN insurator_planner planner ON planner.id = ij.planner_id
                                              LEFT JOIN insurator_ga ga ON ga.id = planner.ga_id
                                              LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                                            AND planner_fee.ins_prod_com_id = ipci.id
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM insurator_plan_stts
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                        ) ips on ips.plan_stts_cd = ij.plan_stts_cd
            WHERE 1=1
                  AND insured.deleted_dt IS NULL
                  AND insured.del_yn = 'N'
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanMfliListByPlannerIdOld: `
      SELECT *
      FROM  (
            SELECT  insured.id
                    , CASE WHEN insured.refer_idx IS NOT NULL THEN insured.refer_idx
                           ELSE ij.refer_id 
                           END AS referId
                    , insured.biz_type AS bizType
                    , insured.insured_biz_no AS insuredBizNo
                    , insured.insured_fran_nm AS insuredFranNm
                    , insured.insured_nm AS insuredNm
                    , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                           ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                           END AS address
                    , insured.join_day AS joinDay
                    , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
                    , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
                    , insured.join_ck AS joinCk
                    , insured.join_account AS joinAccount
                    , insured.join_path AS joinPath
                    , insured.created_dt AS createdDt
                    , insured.updated_dt AS updatedDt
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , ici.ins_com_cd AS insComCd
                    , insured.ins_com AS insCom
                    , ici.ins_com_full_nm AS insComFullNm
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                          WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                          ELSE NULL
                          END AS ctrtType
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , planner.user_eml AS plannerEmail
                    , ga.ga_nm AS plannerGa
                    , insured.created_dt AS sortDt
        --             , AS prem_cmpt_dt -- 조회/설계일
        --             , AS send_dt -- 견적제출일
        --             , AS join_dt -- 계약완료일
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN '만기/임박'
        --                    WHEN insured.join_ck = 'Y' THEN '계약완료'
        --                    WHEN tpef.send_yn = 'Y' THEN '견적제출'
        --                    ELSE '조회/설계' 
        --                    END AS planner_status
                      , ij.plan_stts_cd AS planStatusCd
                      , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                            WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                            WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                            ELSE '조회/설계' 
                            END AS plannerStatus
        --             , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN 1
        --                    WHEN insured.join_ck = 'Y' THEN 2
        --                    WHEN tpef.send_yn = 'Y' THEN 3
        --                    ELSE 4 
        --                    END AS orderNo
                    , ips.sort_no AS orderNo
                    , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                        CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                            ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                            END
                                                                        )
                                                                    , NOW())
                          ELSE NULL 
                          END AS insDday
                    , 'N' AS rejoinYn
            FROM tb_insured_mfli_info insured LEFT JOIN tb_meritz_mfli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                              LEFT JOIN tb_kb_mfli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM ins_prod
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                              AND ins_prod_cd = 'mfli'
                                                        ) ipi ON ipi.strt_dt <= insured.created_dt
                                                                AND ipi.end_dt > insured.created_dt
                                              LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                              LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                       AND ipci.ins_com_id = ici.id
                                              LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                            AND ipt.strt_dt <= insured.created_dt
                                                                            AND ipt.end_dt > insured.created_dt
                                              LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                                  AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                              LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                              AND insured.insured_sno = kdmpc.obgt_ins_seq
                                              LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                              INNER JOIN  (
                                                          SELECT *
                                                          FROM insurator_join
                                                          WHERE 1=1
                                                                AND del_dt IS NULL
                                                                AND planner_id IN (%%plannerIds%%)
                                                          ) ij ON ij.ins_prod_com_id = ipci.id
                                                                  AND ij.join_id = insured.id
                                              LEFT JOIN insurator_planner planner ON planner.id = ij.planner_id
                                              LEFT JOIN insurator_ga ga ON ga.id = planner.ga_id
                                              LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                                            AND planner_fee.ins_prod_com_id = ipci.id
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM insurator_plan_stts
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                        ) ips on ips.plan_stts_cd = ij.plan_stts_cd
            WHERE 1=1
                  AND insured.deleted_dt IS NULL
                  AND insured.del_yn = 'N'
      ) a
      WHERE %%WHERE2%%
    `,
    /* 설계내역 조회 */
  },
  DsfSix: {
    /* 풍6 시장 단체가입 조회 */
    selectDsfSixGruopJoinNotSearchAddress: `
      SELECT *
      FROM dsf_six_gruop_join_upload
      WHERE 1=1
            AND id >= 46
            AND zip_cd IS NULL
--       LIMIT 1
    `,

    selectDsfSixGruopJoinNotRefineAddress: `
      SELECT *
      FROM dsf_six_gruop_join_upload
      WHERE 1=1
            AND id >= 46
            AND id NOT IN (49,74,75,103)
            AND zip_cd IS NOT NULL
            AND mgm_bldrgst_pk IS NULL
      LIMIT 1
    `,
    /* 풍6 시장 단체가입 조회 */
  },
  User: {
    /* 설계사 정보 조회 */
    selectUserByUsername: `
      SELECT planner.id AS userId
            , planner.username AS username
            , planner.user_pwd AS password
            , planner.user_pwd_view AS passwordView
            , planner.user_nm AS userNm
            , planner.username AS userTelNo
            , planner.user_eml AS userEmail
            , planner.prnt_planner_id AS parentPlannerId
            , planner.user_grd AS userGrade
            , planner.use_yn AS useYn
            , planner.ga_id AS gaId
            , ga.ga_nm AS gaNm
            , ga.ga_rpsttv_nm AS gaRepresentativeNm
            , ga.ga_addr AS gaAddress
            , ga.ga_addr_dtl AS gaAddressDetail
            , ga.ga_telno AS gaTelNo
            , planner.team_id AS teamId
            , team.team_nm AS teamNm
            , team.prnt_team_id AS parentTeamId
            , team.depth AS teamDepth
            , planner.job_pstn_id AS jobPositionId
            , job_pstn.job_pstn_nm AS jobPositionNm
      FROM insurator_planner planner LEFT JOIN  (
                                                SELECT *
                                                FROM insurator_ga 
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ga ON planner.ga_id = ga.id
                                     LEFT JOIN  (
                                                SELECT *
                                                FROM insurator_org_team 
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) team ON planner.team_id = team.id
                                     LEFT JOIN  (
                                                SELECT *
                                                FROM insurator_job_pstn 
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) job_pstn ON planner.job_pstn_id = job_pstn.id
      WHERE 1=1
            AND planner.del_dt IS NULL
            AND planner.username = ?
      LIMIT 1
    `,

    selectUserFeesByUserId: `
      SELECT  planner.id AS userId
              , planner.username AS username
              , planner.user_pwd AS password
              , planner.user_pwd_view AS passwordView
              , planner.user_nm AS userNm
              , planner.username AS userTelNo
              , planner.user_eml AS userEmail
              , planner.prnt_planner_id AS parentPlannerId
              , planner.user_grd AS userGrade
              , planner.use_yn AS useYn
              , planner.ga_id AS gaId
              , fee.ins_prod_com_id AS insProdComId
              , fee.sell_yn AS sellYn
              , fee.fee_amt AS feeAmt
              , fee.fee_unit AS feeUnit
              , iipc.ctrt_type AS ctrtType
              , iipc.ins_com_api_yn AS insComApiYn
              , prod.ins_prod_cd AS insProdCd
              , prod.ins_prod_nm AS insProdNm
              , prod.ins_prod_full_nm AS insProdFullNm
              , com.ins_com_cd AS insComCd
              , com.ins_com_nm AS insComNm
              , com.ins_com_full_nm AS insComFullNm
              , planner.team_id AS teamId
              , team.team_nm AS teamNm
              , team.prnt_team_id AS parentTeamId
              , team.depth AS teamDepth
              , planner.job_pstn_id AS jobPositionId
              , job_pstn.job_pstn_nm AS jobPositionNm
      FROM insurator_planner planner INNER JOIN (
                                                SELECT *
                                                FROM insurator_planner_fee
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) fee ON fee.planner_id = planner.id
                                     INNER JOIN (
                                                SELECT *
                                                FROM insurator_ins_prod_com
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) iipc ON fee.ins_prod_com_id = iipc.id
                                     INNER JOIN (
                                                SELECT *
                                                FROM ins_prod
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) prod ON iipc.ins_prod_id = prod.id
                                     INNER JOIN (
                                                SELECT *
                                                FROM ins_com
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) com ON iipc.ins_com_id = com.id
                                     LEFT JOIN  (
                                                SELECT *
                                                FROM insurator_org_team 
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) team ON planner.team_id = team.id
                                     LEFT JOIN  (
                                                SELECT *
                                                FROM insurator_job_pstn 
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) job_pstn ON planner.job_pstn_id = job_pstn.id
      WHERE 1=1
            AND planner.del_dt IS NULL
            AND planner.use_yn = 'Y'
            AND planner.id = ?
    `,

    // 자신 포함 하위 설계사 ID 조회
    selectChildUsersByUserId: `
      WITH RECURSIVE parentPlanner AS (

        SELECT  planner.id AS userId
                , planner.username AS username
                , planner.user_pwd AS password
                , planner.user_pwd_view AS passwordView
                , planner.user_nm AS userNm
                , planner.username AS userTelNo
                , planner.user_eml AS userEmail
                , planner.prnt_planner_id AS parentPlannerId
                , planner.user_grd AS userGrade
                , planner.use_yn AS useYn
                , planner.ga_id AS gaId
                , ga.ga_nm AS gaNm
                , ga.ga_rpsttv_nm AS gaRepresentativeNm
                , ga.ga_addr AS gaAddress
                , ga.ga_addr_dtl AS gaAddressDetail
                , ga.ga_telno AS gaTelNo
                , planner.team_id AS teamId
                , team.team_nm AS teamNm
                , team.prnt_team_id AS parentTeamId
                , team.depth AS teamDepth
                , planner.job_pstn_id AS jobPositionId
                , job_pstn.job_pstn_nm AS jobPositionNm
        FROM insurator_planner planner LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_ga 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) ga ON planner.ga_id = ga.id
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_org_team 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) team ON planner.team_id = team.id
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_job_pstn 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) job_pstn ON planner.job_pstn_id = job_pstn.id
        WHERE 1=1
              AND planner.del_dt IS NULL
              AND planner.id = ?
              
        UNION ALL
        
        SELECT  planner.id AS userId
                , planner.username AS username
                , planner.user_pwd AS password
                , planner.user_pwd_view AS passwordView
                , planner.user_nm AS userNm
                , planner.username AS userTelNo
                , planner.user_eml AS userEmail
                , planner.prnt_planner_id AS parentPlannerId
                , planner.user_grd AS userGrade
                , planner.use_yn AS useYn
                , planner.ga_id AS gaId
                , ga.ga_nm AS gaNm
                , ga.ga_rpsttv_nm AS gaRepresentativeNm
                , ga.ga_addr AS gaAddress
                , ga.ga_addr_dtl AS gaAddressDetail
                , ga.ga_telno AS gaTelNo
                , planner.team_id AS teamId
                , team.team_nm AS teamNm
                , team.prnt_team_id AS parentTeamId
                , team.depth AS teamDepth
                , planner.job_pstn_id AS jobPositionId
                , job_pstn.job_pstn_nm AS jobPositionNm
        FROM insurator_planner planner LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_ga 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) ga ON planner.ga_id = ga.id
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_org_team 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) team ON planner.team_id = team.id
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_job_pstn 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) job_pstn ON planner.job_pstn_id = job_pstn.id
                                       INNER JOIN parentPlanner parent ON planner.prnt_planner_id = parent.userId
                                                                          AND CASE WHEN parent.parentTeamId IS NULL OR parent.parentTeamId = 0 THEN 1=1
                                                                                   ELSE parent.parentTeamId = team.id
                                                                                   END
        WHERE 1=1
              AND planner.del_dt IS NULL
      
      )
      
      SELECT * 
      FROM parentPlanner
      ORDER BY userGrade
    `,

    // 자신 포함 상위 설계사 수수료 조회
    selectParentUsersFeeByUserId: `
      WITH RECURSIVE plannerFee AS (

        SELECT 0 AS depth
		 , planner.id AS userId
               , planner.username AS username
               , planner.user_pwd AS password
               , planner.user_pwd_view AS passwordView
               , planner.user_nm AS userNm
               , planner.username AS userTelNo
               , planner.user_eml AS userEmail
               , planner.prnt_planner_id AS parentPlannerId
               , CASE WHEN IFNULL(fee.fee_amt, 0) = 0 THEN 'N'
                      ELSE fee.sell_yn
                      END AS settlementYn
               , planner.user_grd AS userGrade
               , planner.use_yn AS useYn
               , ij.id AS insuratorJoinId
               , fee.ins_prod_com_id AS insProdComId
               , planner.ga_id AS gaId
               , planner.team_id AS teamId
               , team.team_nm AS teamNm
               , team.prnt_team_id AS parentTeamId
               , team.depth AS teamDepth
               , CASE WHEN fee.sell_yn = 'N' THEN 0
                      WHEN planner.id = ij.planner_id THEN IFNULL(joinFee.fee_amt, ij.fee_amt)
                      ELSE IFNULL(joinFee.fee_amt, fee.fee_amt)
                      END AS defaultFeeAmt
               , fee.fee_unit AS defaultFeeUnit
               , ij.planner_id AS sourceUserId
               , CASE WHEN planner.id = ij.planner_id THEN IFNULL(joinFee.fee_amt, ij.fee_amt)
                      ELSE IFNULL(joinFee.fee_amt, fee.fee_amt)
                      END AS sourceFeeAmt
               , CASE WHEN planner.id = ij.planner_id THEN IFNULL(joinFee.fee_unit, ij.fee_unit)
                      ELSE IFNULL(joinFee.fee_unit, fee.fee_unit)
                      END AS sourceFeeUnit
               , CASE WHEN fee.sell_yn = 'N' THEN 0
                      WHEN planner.id = ij.planner_id THEN IFNULL(joinFee.fee_amt, ij.fee_amt)
                      ELSE IFNULL(joinFee.fee_amt, fee.fee_amt)
                      END AS realFeeAmt
               , CASE WHEN planner.id = ij.planner_id THEN 0
                      ELSE IFNULL(joinFee.fee_amt, fee.fee_amt)
                      END AS childFeeAmt
        FROM insurator_planner planner CROSS JOIN insurator_join ij
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_join_fee
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) joinFee ON ij.id = joinFee.insurator_join_id
                                                              AND joinFee.planner_id = planner.id
                                       LEFT JOIN insurator_planner_fee fee ON fee.planner_id = planner.id
                                                                              AND fee.ins_prod_com_id = ij.ins_prod_com_id
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_org_team 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) team ON planner.team_id = team.id
        WHERE 1=1
              AND planner.del_dt IS NULL
              AND planner.id = ?
              AND ij.id = ?
              
        UNION ALL
        
        SELECT child.depth + 1 AS depth
		 , planner.id AS userId
               , planner.username AS username
               , planner.user_pwd AS password
               , planner.user_pwd_view AS passwordView
               , planner.user_nm AS userNm
               , planner.username AS userTelNo
               , planner.user_eml AS userEmail
               , planner.prnt_planner_id AS parentPlannerId
               , CASE WHEN IFNULL(fee.fee_amt, 0) = 0 THEN 'N'
                      ELSE fee.sell_yn
                      END AS settlementYn
               , planner.user_grd AS userGrade
               , planner.use_yn AS useYn
               , child.insuratorJoinId AS insuratorJoinId
               , fee.ins_prod_com_id AS insProdComId
               , planner.ga_id AS gaId
               , planner.team_id AS teamId
               , team.team_nm AS teamNm
               , team.prnt_team_id AS parentTeamId
               , team.depth AS teamDepth
               , fee.fee_amt AS defaultFeeAmt
               , fee.fee_unit AS defaultFeeUnit
               , child.sourceUserId AS sourceUserId
               , child.sourceFeeAmt AS sourceFeeAmt
               , child.sourceFeeUnit AS sourceFeeUnit
               , CASE WHEN IFNULL(joinFee.fee_amt, fee.fee_amt) IS NULL OR IFNULL(joinFee.fee_amt, fee.fee_amt) = 0 OR fee.sell_yn = 'N' THEN child.realFeeAmt
                      ELSE IFNULL(joinFee.fee_amt, fee.fee_amt)
                      END AS realFeeAmt
               , CASE WHEN child.settlementYn = 'N' THEN child.childFeeAmt
                      ELSE child.defaultFeeAmt 
                      END AS childFeeAmt
        FROM insurator_planner planner LEFT JOIN insurator_planner_fee fee ON fee.planner_id = planner.id
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_org_team 
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) team ON planner.team_id = team.id
                                       INNER JOIN plannerFee child ON planner.id = child.parentPlannerId
                                                                       AND fee.ins_prod_com_id = child.insProdComId
                                                                       AND CASE WHEN child.parentTeamId IS NULL OR child.parentTeamId = 0 THEN 1=1
                                                                                ELSE child.parentTeamId = team.id
                                                                                END
                                       LEFT JOIN (
                                                 SELECT *
                                                 FROM insurator_join_fee
                                                 WHERE 1=1
                                                       AND del_dt IS NULL
                                                 ) joinFee ON child.insuratorJoinId = joinFee.insurator_join_id
                                                              AND joinFee.planner_id = planner.id
        WHERE 1=1
              AND planner.del_dt IS NULL
      
      )
      
      SELECT pf.*
             , CASE WHEN pf.settlementYn = 'N' THEN 0
                    WHEN pf.settlementYn = 'Y' AND pf.userId = pf.sourceUserId THEN pf.sourceFeeAmt - pf.childFeeAmt
                    ELSE pf.defaultFeeAmt - pf.childFeeAmt
                    END AS calcFeeAmt
      FROM plannerFee pf
      ORDER BY userGrade DESC, parentPlannerId DESC
    `,
    /* 설계사 정보 조회 */
  },
  Plan: {
    /* 지역 정보 조회 */
    selectRegionNmBySigunguCd: `
      SELECT region_first_depth_nm AS regionFirstDepthNm
             , region_second_depth_nm AS regionSecondDepthNm
      FROM tb_region_depth_nm
      WHERE 1=1
            AND sigungu_cd = ?
      LIMIT 1
    `,
    /* 지역 정보 조회 */

    /* 사업자 정보 조회 */
    selectFinpcCorpBusinessInfoByAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , NULL AS ownerNm
                     , NULL AS ownerNo
                     , bzno_corp AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , NULL AS franEmail
                     , NULL AS establishDt
                     , REGEXP_REPLACE(sales_cnt, "[-,]", "") AS salesCost
                     , NULL AS totAnnualWages
                     , REGEXP_REPLACE(employee_cnt, "[-,]", "") AS employeeCnt
                     , 'finpccorp' AS origin
              FROM tb_finpc_corp_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND (a.trimFranAddress LIKE ? OR a.trimFranAddress LIKE ?)
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectFinpcCorpBusinessInfoByOneAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , NULL AS ownerNm
                     , NULL AS ownerNo
                     , bzno_corp AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , NULL AS franEmail
                     , NULL AS establishDt
                     , REGEXP_REPLACE(sales_cnt, "[-,]", "") AS salesCost
                     , NULL AS totAnnualWages
                     , REGEXP_REPLACE(employee_cnt, "[-,]", "") AS employeeCnt
                     , 'finpccorp' AS origin
              FROM tb_finpc_corp_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND a.trimFranAddress LIKE ?
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectZeropayBusinessInfoByAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , NULL AS ownerNm
                     , NULL AS ownerNo
                     , NULL AS corpNo
                     , kbc_bzc_cd AS bzcCd
                     , bzc_nm AS bzcNm
                     , NULL AS franEmail
                     , NULL AS establishDt
                     , NULL AS salesCost
                     , NULL AS totAnnualWages
                     , NULL AS employeeCnt
                     , 'zeropay' AS origin
              FROM tb_zeropay_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND (a.trimFranAddress LIKE ? OR a.trimFranAddress LIKE ?)
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectZeropayBusinessInfoByOneAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , NULL AS ownerNm
                     , NULL AS ownerNo
                     , NULL AS corpNo
                     , kbc_bzc_cd AS bzcCd
                     , bzc_nm AS bzcNm
                     , NULL AS franEmail
                     , NULL AS establishDt
                     , NULL AS salesCost
                     , NULL AS totAnnualWages
                     , NULL AS employeeCnt
                     , 'zeropay' AS origin
              FROM tb_zeropay_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND a.trimFranAddress LIKE ?
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectKodataBusinessInfoByAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , NULL AS ownerNm
                     , NULL AS ownerNo
                     , NULL AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , NULL AS franEmail
                     , NULL AS establishDt
                     , est_sales_1y AS salesCost
                     , NULL AS totAnnualWages
                     , em2021 AS employeeCnt
                     , 'kodata' AS origin
              FROM tb_kodata_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND (a.trimFranAddress LIKE ? OR a.trimFranAddress LIKE ?)
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectKodataBusinessInfoByOneAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , NULL AS ownerNm
                     , NULL AS ownerNo
                     , NULL AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , NULL AS franEmail
                     , NULL AS establishDt
                     , est_sales_1y AS salesCost
                     , NULL AS totAnnualWages
                     , em2021 AS employeeCnt
                     , 'kodata' AS origin
              FROM tb_kodata_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND a.trimFranAddress LIKE ?
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectKodataCorpBusinessInfoByAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , owner_nm AS ownerNm
                     , REPLACE(owner_no, "-", "") AS ownerNo
                     , REPLACE(bzno_corp, "*", "") AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , gen_email AS franEmail
                     , NULL AS establishDt
                     , REGEXP_REPLACE(sales_cnt, "[-,]", "") AS salesCost
                     , NULL AS totAnnualWages
                     , REGEXP_REPLACE(employee_cnt, "[-,]", "") AS employeeCnt
                     , 'kodatacorp' AS origin
              FROM tb_kodata_corp_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND (a.trimFranAddress LIKE ? OR a.trimFranAddress LIKE ?)
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectKodataCorpBusinessInfoByOneAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , owner_nm AS ownerNm
                     , REPLACE(owner_no, "-", "") AS ownerNo
                     , REPLACE(bzno_corp, "*", "") AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , gen_email AS franEmail
                     , NULL AS establishDt
                     , REGEXP_REPLACE(sales_cnt, "[-,]", "") AS salesCost
                     , NULL AS totAnnualWages
                     , REGEXP_REPLACE(employee_cnt, "[-,]", "") AS employeeCnt
                     , 'kodatacorp' AS origin
              FROM tb_kodata_corp_business_info
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND a.trimFranAddress LIKE ?
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectKodataCorpBusinessInfo2ByAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , owner_nm AS ownerNm
                     , owner_no AS ownerNo
                     , bzno_corp AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , gen_email AS franEmail
                     , estb_dt AS establishDt
                     , sales AS salesCost
                     , wage AS totAnnualWages
                     , gobo2312 AS employeeCnt
                     , 'kodatacorp2' AS origin
              FROM kodata_corp_business
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND (a.trimFranAddress LIKE ? OR a.trimFranAddress LIKE ?)
      ORDER BY a.id DESC
      LIMIT 1
    `,

    selectKodataCorpBusinessInfo2ByOneAddressFranNm: `
      SELECT *
      FROM    (
              SELECT seq_no AS id
                     , bzno
                     , fran_nm AS franNm
                     , REPLACE(fran_nm, ' ' , '') AS trimFranNm
                     , fran_addr AS franAddress
                     , REPLACE(fran_addr, ' ' , '') AS trimFranAddress
                     , owner_nm AS ownerNm
                     , owner_no AS ownerNo
                     , bzno_corp AS corpNo
                     , SUBSTR(bzc_cd, 2) AS bzcCd
                     , bzc_nm AS bzcNm
                     , gen_email AS franEmail
                     , estb_dt AS establishDt
                     , sales AS salesCost
                     , wage AS totAnnualWages
                     , gobo2312 AS employeeCnt
                     , 'kodatacorp2' AS origin
              FROM kodata_corp_business
              ) a
      WHERE 1=1
            AND a.trimFranNm LIKE ?
            AND a.trimFranAddress LIKE ?
      ORDER BY a.id DESC
      LIMIT 1
    `,
    /* 사업자 정보 조회 */

    /* 업종 정보 조회 */
    selectBoonMeritzDliObj: `
      SELECT tdocm.boon_obj_nm AS boonObjNm
             , tmdoci.obj_cd AS objCd
             , tmdoci.obj_nm AS objNm
             , tmdmcbi.unit_cd AS unitCd
             , tmdmcbi.unit_nm AS unitNm
             , tmdoci.avlb_yn AS avlbYn
      FROM tb_dli_obj_cd_map tdocm LEFT JOIN tb_meritz_dli_obj_cd_info tmdoci ON tdocm.meritz_seq_no = tmdoci.seq_no
                                   LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmdoci.cmpt_base_seq = tmdmcbi.seq_no
                                   LEFT JOIN tb_kb_dli_obj_cd_info tkdoci ON tdocm.kb_seq_no = tkdoci.seq_no
                                   LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkdoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tdocm.boon_obj_nm = ?
    `,

    selectMeritzDliObj: `
      SELECT tdocm.boon_obj_nm AS boonObjNm
             , tmdoci.obj_cd AS objCd
             , tmdoci.obj_nm AS objNm
             , tmdmcbi.unit_cd AS unitCd
             , tmdmcbi.unit_nm AS unitNm
             , tmdoci.avlb_yn AS avlbYn
      FROM tb_dli_obj_cd_map tdocm LEFT JOIN tb_meritz_dli_obj_cd_info tmdoci ON tdocm.meritz_seq_no = tmdoci.seq_no
                                   LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmdoci.cmpt_base_seq = tmdmcbi.seq_no
      WHERE 1=1 
            AND tmdoci.obj_nm = ?
    `,

    selectBoonKbDliObj: `
      SELECT tdocm.boon_obj_nm AS boonObjNm
             , tkdoci.obj_cd AS objCd
             , tkdoci.obj_nm AS objNm
             , tkdmcbi.unit_cd AS unitCd
             , tkdmcbi.unit_nm AS unitNm
             , tkdoci.avlb_yn AS avlbYn
      FROM tb_dli_obj_cd_map tdocm LEFT JOIN tb_meritz_dli_obj_cd_info tmdoci ON tdocm.meritz_seq_no = tmdoci.seq_no
                                   LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmdoci.cmpt_base_seq = tmdmcbi.seq_no
                                   LEFT JOIN tb_kb_dli_obj_cd_info tkdoci ON tdocm.kb_seq_no = tkdoci.seq_no
                                   LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkdoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tdocm.boon_obj_nm = ?
    `,

    selectKbDliObj: `
      SELECT tdocm.boon_obj_nm AS boonObjNm
             , tkdoci.obj_cd AS objCd
             , tkdoci.obj_nm AS objNm
             , tkdmcbi.unit_cd AS unitCd
             , tkdmcbi.unit_nm AS unitNm
             , tkdoci.avlb_yn AS avlbYn
      FROM tb_dli_obj_cd_map tdocm LEFT JOIN tb_kb_dli_obj_cd_info tkdoci ON tdocm.kb_seq_no = tkdoci.seq_no
                                   LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkdoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tkdoci.obj_nm = ?
    `,

    selectBoonMeritzMfliObj: `
      SELECT tmocm.boon_obj_nm AS boonObjNm
             , tmmoci.obj_cd AS objCd
             , tmmoci.obj_nm AS objNm
             , tmdmcbi.unit_cd AS unitCd
             , tmdmcbi.unit_nm AS unitNm
             , tmmoci.avlb_yn AS avlbYn
      FROM tb_mfli_obj_cd_map tmocm LEFT JOIN tb_meritz_mfli_obj_cd_info tmmoci ON tmocm.meritz_seq_no = tmmoci.seq_no
                                    LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmmoci.cmpt_base_seq = tmdmcbi.seq_no
                                    LEFT JOIN tb_kb_mfli_obj_cd_info tkmoci ON tmocm.kb_seq_no = tkmoci.seq_no
                                    LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkmoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tmocm.boon_obj_nm = ?
    `,

    selectMeritzMfliObj: `
      SELECT tmocm.boon_obj_nm AS boonObjNm
             , tmmoci.obj_cd AS objCd
             , tmmoci.obj_nm AS objNm
             , tmdmcbi.unit_cd AS unitCd
             , tmdmcbi.unit_nm AS unitNm
             , tmmoci.avlb_yn AS avlbYn
      FROM tb_mfli_obj_cd_map tmocm LEFT JOIN tb_meritz_mfli_obj_cd_info tmmoci ON tmocm.meritz_seq_no = tmmoci.seq_no
                                    LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmmoci.cmpt_base_seq = tmdmcbi.seq_no
      WHERE 1=1 
            AND tmmoci.obj_nm = ?
    `,

    selectBoonKbMfliObj: `
      SELECT tmocm.boon_obj_nm AS boonObjNm
             , tkmoci.obj_cd AS objCd
             , tkmoci.obj_nm AS objNm
             , tkdmcbi.unit_cd AS unitCd
             , tkdmcbi.unit_nm AS unitNm
             , tkmoci.avlb_yn AS avlbYn
      FROM tb_mfli_obj_cd_map tmocm LEFT JOIN tb_meritz_mfli_obj_cd_info tmmoci ON tmocm.meritz_seq_no = tmmoci.seq_no
                                    LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmmoci.cmpt_base_seq = tmdmcbi.seq_no
                                    LEFT JOIN tb_kb_mfli_obj_cd_info tkmoci ON tmocm.kb_seq_no = tkmoci.seq_no
                                    LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkmoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tmocm.boon_obj_nm = ?
    `,

    selectKbMfliObj: `
      SELECT tmocm.boon_obj_nm AS boonObjNm
             , tkmoci.obj_cd AS objCd
             , tkmoci.obj_nm AS objNm
             , tkdmcbi.unit_cd AS unitCd
             , tkdmcbi.unit_nm AS unitNm
             , tkmoci.avlb_yn AS avlbYn
      FROM tb_mfli_obj_cd_map tmocm LEFT JOIN tb_kb_mfli_obj_cd_info tkmoci ON tmocm.kb_seq_no = tkmoci.seq_no
                                    LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkmoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tkmoci.obj_nm = ?
    `,

    selectMeritzDliObjNmList: `
      SELECT tmdoci.obj_cd AS objCd
             , tmdoci.obj_nm AS objNm
             , tmdmcbi.unit_cd AS unitCd
             , tmdmcbi.unit_nm AS unitNm
             , tmdoci.avlb_yn AS avlbYn
      FROM tb_meritz_dli_obj_cd_info tmdoci LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmdoci.cmpt_base_seq = tmdmcbi.seq_no
      WHERE 1=1 
            AND tmdoci.obj_cd = ?
    `,

    selectMeritzMfliObjNmList: `
      SELECT tmmoci.obj_cd AS objCd
             , tmmoci.obj_nm AS objNm
             , tmdmcbi.unit_cd AS unitCd
             , tmdmcbi.unit_nm AS unitNm
             , tmmoci.avlb_yn AS avlbYn
      FROM tb_meritz_mfli_obj_cd_info tmmoci LEFT JOIN tb_meritz_dli_mfli_cmpt_base_info tmdmcbi ON tmmoci.cmpt_base_seq = tmdmcbi.seq_no
      WHERE 1=1 
            AND tmmoci.dev_cd = ?
    `,

    selectKbDliObjNmList: `
      SELECT tkdoci.obj_cd AS objCd
             , tkdoci.obj_nm AS objNm
             , tkdmcbi.unit_cd AS unitCd
             , tkdmcbi.unit_nm AS unitNm
             , tkdoci.avlb_yn AS avlbYn
      FROM tb_kb_dli_obj_cd_info tkdoci LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkdoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tkdoci.dev_cd = ?
    `,

    selectKbMfliObjNmList: `
      SELECT tkmoci.obj_cd AS objCd
             , tkmoci.obj_nm AS objNm
             , tkdmcbi.unit_cd AS unitCd
             , tkdmcbi.unit_nm AS unitNm
             , tkmoci.avlb_yn AS avlbYn
      FROM tb_kb_mfli_obj_cd_info tkmoci LEFT JOIN tb_kb_dli_mfli_cmpt_base_info tkdmcbi ON tkmoci.cmpt_base_seq = tkdmcbi.seq_no
      WHERE 1=1 
            AND tkmoci.dev_cd = ?
    `,
    /* 업종 정보 조회 */

    /* 보험사 로그 조회 */
    selectMeritzDliMfliPremCmptLog: `
      SELECT  aflco_div_cd AS aflcoDivCd
              , pd_cd AS pdCd
              , sbcp_dt AS sbcpDt
              , ins_bgn_dt AS insBgnDt
              , ins_ed_dt AS insEdDt
              , polhd_nm AS polhdNm
              , polhd_bizpe_no AS polhdBizpeNo
              , polhd_crp_no AS polhdCrpNo
              , polhd_rsid_no AS polhdRsidNo
              , inspe_nm AS inspeNm
              , inspe_bizpe_no AS inspeBizpeNo
              , inspe_crp_no AS inspeCrpNo
              , inspe_rsid_no AS inspeRsidNo
              , obj_cd AS objCd
              , cmpt_base_num AS cmptBaseNum
              , pcpt_coms_lm_amt AS pcptComsLmAmt
              , prda_oplm_amt AS prdaOplmAmt
              , owbr_amt AS owbrAmt
              , fm_nm AS fmNm
              , lctn_adr AS lctnAdr
              , dsst_cmps_sno AS dsstCmpsSno
              , ath_no AS athNo
              , agr_inf_con AS agrInfCon
              , rnwl_bf_pol_no AS rnwlBfPolNo
      FROM tb_meritz_dli_mfli_prem_cmpt_logs
      WHERE 1=1
            AND prctr_no = ?
            AND purps = ?
    `,

    selectKbDliMfliPremCmptLog: `
      SELECT  co_cd AS coCd
              , pd_cd AS pdCd
              , group_cont_yn AS groupContYn
              , apc_date AS apcDate
              , ins_bg_dt AS insBgDt
              , ins_end_dt AS insEndDt
              , polhd_nm AS polhdNm
              , polhd_bzrgno AS polhdBzrgno
              , insdps_nm AS insdpsNm
              , insdps_idno AS insdpsIdno
              , ntr_obj_cd AS ntrObjCd
              , rate_calc_fndtn_cnt AS rateCalcFndtnCnt
              , perps_lol AS perpsLol
              , peracc_lol AS peraccLol
              , bzplc_cfcd AS bzplcCfcd
              , loct_hngl_nm AS loctHngl_nm
              , korlg_bsadr AS korlgBsadr
              , korlg_dtadr AS korlgDtadr
              , loct_post_no_1 AS loctPostNo1
              , loct_post_no_2 AS loctPostNo2
              , acc_yn AS accYn
              , obgt_ins_seq AS obgtInsSeq
              , rnwl_pcno AS rnwlPcno
              , srdng_bldg_gap_dist AS srdngBldgGapDist
      FROM tb_kb_dli_mfli_prem_cmpt_logs
      WHERE 1=1
            AND apcno = ?
            AND purps = ?
    `,
    /* 보험사 로그 조회 */
  },
  Join: {
    /* 인슈에이터 가입내역 보험상품코드 조회 */
    selectInsuratorJoinByInsuratorJoinId: `
      SELECT ij.id
             , ij.refer_id AS referId
             , ij.planner_id AS plannerId
             , ij.ins_prod_com_id AS insProdComId
             , ij.join_id AS joinId
             , ij.tmp_id AS tmpId
             , ij.plan_stts_cd AS planSttsCd
             , ipi.ins_prod_cd AS insProdCd
             , ipi.ins_prod_nm AS insProdNm
             , ipi.ins_prod_full_nm AS insProdFullNm
             , ici.ins_com_cd AS insComCd
             , ici.ins_com_nm AS insComNm
             , ici.ins_com_full_nm AS insComFullNm
    FROM insurator_join ij  INNER JOIN insurator_ins_prod_com ipci ON ipci.id = ij.ins_prod_com_id
                            LEFT JOIN     (
                                          SELECT *
                                          FROM ins_prod
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                          ) ipi ON ipi.id = ipci.ins_prod_id
                            LEFT JOIN ins_com ici ON ici.id = ipci.ins_com_id
    WHERE 1=1
          AND ij.del_dt IS NULL
          AND ij.id = ?
    `,
    /* 인슈에이터 가입내역 보험상품코드 조회 */

    /* 기가입자 중복 조회 */
    selectDliJoinByInsuredBizNo: `
      SELECT id
             , insured_biz_no AS insuredBizNo
             , insured_sno AS insuredSno
             , CASE WHEN ins_start_hm IS NULL THEN CONCAT(LEFT(ins_start_dt, 10), ' 24:00')
                    ELSE CONCAT(LEFT(ins_start_dt, 10), ' ', ins_start_hm) 
                    END AS insStartDt
             , CASE WHEN ins_end_hm IS NULL THEN CONCAT(LEFT(ins_end_dt, 10), ' 24:00')
                    ELSE CONCAT(LEFT(ins_end_dt, 10), ' ', ins_end_hm) 
                    END AS insEndDt
             , join_ck AS joinCk
             , join_account AS joinAccount
             , join_path AS joinPath
             , 'dli' AS insProdCd
             , ins_prod_nm AS insProdNm
             , pay_yn AS payYn
             , pay_status AS payStatusCd
             , biz_member_seq_no AS bizMemberId
             , NULL AS insuredJibunAddr
             , new_plat_plc AS insuredRoadAddr
             , new_plat_plc_etc AS insuredRoadAddrDetail
             , join_day AS joinYmd
             , biz_type AS insuredBizNoGbCd
             , insured_fran_nm AS insuredFranNm
             , insured_owner_yn AS insuredOwnerFlag
             , insured_bzc_boon_nm AS insuredBzcBoonNm
             , calc_amt AS calcAmt
             , 4 AS insuredBzcOrigin
             , mgm_bldrgst_pk AS mgmBldrgstPk
             , sigungu_cd AS sigunguCd
             , bjdong_cd AS bjdongCd
             , zip_cd AS zipCd
      FROM tb_insured_dli_info insured
      WHERE 1=1
            AND deleted_dt IS NULL
            AND del_yn = 'N'
            AND join_ck IN (%%joinStatusCds%%)
            AND CURRENT_TIMESTAMP() < CASE WHEN ins_end_hm IS NULL OR ins_end_hm = '24:00' THEN DATE(CONCAT(LEFT(DATE_ADD(ins_end_dt, INTERVAL 1 DAY), 10), ' 00:00'))
                                           ELSE DATE(CONCAT(LEFT(ins_end_dt, 10), ' ', ins_end_hm))
                                           END
            AND insured_biz_no = ?
      ORDER BY id DESC
    `,

    selectMfliJoinByInsuredBizNo: `
      SELECT id
             , insured_biz_no AS insuredBizNo
             , insured_sno AS insuredSno
             , CASE WHEN ins_start_hm IS NULL THEN CONCAT(LEFT(ins_start_dt, 10), ' 24:00')
                    ELSE CONCAT(LEFT(ins_start_dt, 10), ' ', ins_start_hm) 
                    END AS insStartDt
             , CASE WHEN ins_end_hm IS NULL THEN CONCAT(LEFT(ins_end_dt, 10), ' 24:00')
                    ELSE CONCAT(LEFT(ins_end_dt, 10), ' ', ins_end_hm) 
                    END AS insEndDt
             , join_ck AS joinCk
             , join_account AS joinAccount
             , join_path AS joinPath
             , 'mfli' AS insProdCd
             , ins_prod_nm AS insProdNm
             , pay_yn AS payYn
             , pay_status AS payStatusCd
             , biz_member_seq_no AS bizMemberId
             , NULL AS insuredJibunAddr
             , new_plat_plc AS insuredRoadAddr
             , new_plat_plc_etc AS insuredRoadAddrDetail
             , join_day AS joinYmd
             , biz_type AS insuredBizNoGbCd
             , insured_fran_nm AS insuredFranNm
             , insured_owner_yn AS insuredOwnerFlag
             , insured_bzc_boon_nm AS insuredBzcBoonNm
             , calc_amt AS calcAmt
             , 4 AS insuredBzcOrigin
             , mgm_bldrgst_pk AS mgmBldrgstPk
             , sigungu_cd AS sigunguCd
             , bjdong_cd AS bjdongCd
             , zip_cd AS zipCd
      FROM tb_insured_mfli_info insured
      WHERE 1=1
            AND deleted_dt IS NULL
            AND del_yn = 'N'
            AND join_ck IN (%%joinStatusCds%%)
            AND CURRENT_TIMESTAMP() < CASE WHEN ins_end_hm IS NULL OR ins_end_hm = '24:00' THEN DATE(CONCAT(LEFT(DATE_ADD(ins_end_dt, INTERVAL 1 DAY), 10), ' 00:00'))
                                           ELSE DATE(CONCAT(LEFT(ins_end_dt, 10), ' ', ins_end_hm))
                                           END
            AND insured_biz_no = ?
      ORDER BY id DESC
    `,
    /* 기가입자 중복 조회 */

    /* 가입내역 상세 조회 */
    selectInusredDliDetailByInsuredId: `
      SELECT  insured.id
              , insured.refer_idx AS referId
              , insured.biz_type AS bizType
              , insured.insured_biz_no AS insuredBizNo
              , insured.insured_fran_nm AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , insured.insured_sno AS insuredSno
              , insured.insured_bzc_boon_cd AS insuredBzcBoonCd
              , insured.insured_bzc_boon_nm AS insuredBzcBoonNm
              , CASE WHEN insured.ins_com = '메리츠' THEN moci.obj_nm
                     WHEN insured.ins_com = 'KB손해보험' THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , insured.calc_amt AS calcAmt
              , insured.calc_unit_cd AS calcUnitCd
              , insured.calc_unit_nm AS calcUnitNm
              , insured.zip_cd AS zipCd
              , insured.new_plat_plc AS newPlatPlc
              , insured.new_plat_plc_etc AS newPlatPlcEtc
              , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     END AS address
              , insured.join_day AS joinDay
              , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
              , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
              , insured.bd_guaranteed_cost AS bdGuaranteedCost
              , insured.pt_guaranteed_cost AS ptGuaranteedCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , insured.apply_cost AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , insured.insured_owner_yn AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , insured.join_account AS joinAccount
              , insured.join_path AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , insured.prctr_no AS prctrNo
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0 
                     END AS premCmptSeqNo
              , insured.updated_dt AS updatedDt
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                     WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                     ELSE NULL
                     END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , insured.biz_member_seq_no AS bizMemberId
              , CASE WHEN ij.id IS NOT NULL THEN 'Y'
                     ELSE 'N' 
                     END AS insuratorYn
              , ij.team_id AS teamId
              , ij.job_pstn_id AS jobPositionId
              , insured.referer AS url
              , insured.insured_fran_nm AS sendNm
              , ipi.ins_prod_full_nm AS sendInsProdFullNm
      FROM tb_insured_dli_info insured  LEFT JOIN tb_meritz_dli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                        LEFT JOIN tb_kb_dli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM ins_prod
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                        AND ins_prod_cd = 'dli'
                                                  ) ipi ON ipi.strt_dt <= insured.created_dt
                                                          AND ipi.end_dt > insured.created_dt
                                        LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                        LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                 AND ipci.ins_com_id = ici.id
                                        LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                       AND ipt.strt_dt <= insured.created_dt
                                                                       AND ipt.end_dt > insured.created_dt
                                        LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                             AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                        LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                         AND insured.insured_sno = kdmpc.obgt_ins_seq
                                        LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM insurator_join
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                  ) ij ON ij.join_id = insured.id
      WHERE 1=1
            AND insured.deleted_dt IS NULL
            AND insured.del_yn = 'N'
            AND insured.id = ?
    `,

    selectInusredDliDetailByReferId: `
      SELECT  insured.id
              , insured.refer_idx AS referId
              , insured.biz_type AS bizType
              , insured.insured_biz_no AS insuredBizNo
              , insured.insured_fran_nm AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , insured.insured_sno AS insuredSno
              , insured.insured_bzc_boon_cd AS insuredBzcBoonCd
              , insured.insured_bzc_boon_nm AS insuredBzcBoonNm
              , CASE WHEN insured.ins_com = '메리츠' THEN moci.obj_nm
                     WHEN insured.ins_com = 'KB손해보험' THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , insured.calc_amt AS calcAmt
              , insured.calc_unit_cd AS calcUnitCd
              , insured.calc_unit_nm AS calcUnitNm
              , insured.zip_cd AS zipCd
              , insured.new_plat_plc AS newPlatPlc
              , insured.new_plat_plc_etc AS newPlatPlcEtc
              , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     END AS address
              , insured.join_day AS joinDay
              , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
              , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
              , insured.bd_guaranteed_cost AS bdGuaranteedCost
              , insured.pt_guaranteed_cost AS ptGuaranteedCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , insured.apply_cost AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , insured.insured_owner_yn AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , insured.join_account AS joinAccount
              , insured.join_path AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , insured.prctr_no AS prctrNo
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0 
                     END AS premCmptSeqNo
              , insured.updated_dt AS updatedDt
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                     WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                     ELSE NULL
                     END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , insured.biz_member_seq_no AS bizMemberId
              , CASE WHEN ij.id IS NOT NULL THEN 'Y'
                     ELSE 'N' 
                     END AS insuratorYn
              , ij.team_id AS teamId
              , ij.job_pstn_id AS jobPositionId
              , insured.referer AS url
              , insured.insured_fran_nm AS sendNm
              , ipi.ins_prod_full_nm AS sendInsProdFullNm
      FROM tb_insured_dli_info insured  LEFT JOIN tb_meritz_dli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                        LEFT JOIN tb_kb_dli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM ins_prod
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                        AND ins_prod_cd = 'dli'
                                                  ) ipi ON ipi.strt_dt <= insured.created_dt
                                                           AND ipi.end_dt > insured.created_dt
                                        LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                        LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                 AND ipci.ins_com_id = ici.id
                                        LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                       AND ipt.strt_dt <= insured.created_dt
                                                                       AND ipt.end_dt > insured.created_dt
                                        LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                             AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                        LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                         AND insured.insured_sno = kdmpc.obgt_ins_seq
                                        LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM insurator_join
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                  ) ij ON ij.join_id = insured.id
      WHERE 1=1
            AND insured.deleted_dt IS NULL
            AND insured.del_yn = 'N'
            AND insured.refer_idx = ?
    `,

    selectInusredDliDetailByJoinId: `
      SELECT  insured.id
              , insured.refer_idx AS referId
              , insured.biz_type AS bizType
              , insured.insured_biz_no AS insuredBizNo
              , insured.insured_fran_nm AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , insured.insured_sno AS insuredSno
              , insured.insured_bzc_boon_cd AS insuredBzcBoonCd
              , insured.insured_bzc_boon_nm AS insuredBzcBoonNm
              , CASE WHEN insured.ins_com = '메리츠' THEN moci.obj_nm
                     WHEN insured.ins_com = 'KB손해보험' THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , insured.calc_amt AS calcAmt
              , insured.calc_unit_cd AS calcUnitCd
              , insured.calc_unit_nm AS calcUnitNm
              , insured.zip_cd AS zipCd
              , insured.new_plat_plc AS newPlatPlc
              , insured.new_plat_plc_etc AS newPlatPlcEtc
              , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     END AS address
              , insured.join_day AS joinDay
              , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
              , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
              , insured.bd_guaranteed_cost AS bdGuaranteedCost
              , insured.pt_guaranteed_cost AS ptGuaranteedCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , insured.apply_cost AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , insured.insured_owner_yn AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , insured.join_account AS joinAccount
              , insured.join_path AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , insured.prctr_no AS prctrNo
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0 
                     END AS premCmptSeqNo
              , insured.updated_dt AS updatedDt
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                     WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                     ELSE NULL
                     END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , insured.biz_member_seq_no AS bizMemberId
              , CASE WHEN ij.id IS NOT NULL THEN 'Y'
                     ELSE 'N' 
                     END AS insuratorYn
              , ij.team_id AS teamId
              , ij.job_pstn_id AS jobPositionId
              , insured.referer AS url
              , insured.insured_fran_nm AS sendNm
              , ipi.ins_prod_full_nm AS sendInsProdFullNm
      FROM tb_insured_dli_info insured  LEFT JOIN tb_meritz_dli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                        LEFT JOIN tb_kb_dli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM ins_prod
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                        AND ins_prod_cd = 'dli'
                                                  ) ipi ON ipi.strt_dt <= insured.created_dt
                                                           AND ipi.end_dt > insured.created_dt
                                        LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                        LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                 AND ipci.ins_com_id = ici.id
                                        LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                       AND ipt.strt_dt <= insured.created_dt
                                                                       AND ipt.end_dt > insured.created_dt
                                        LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                             AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                        LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                         AND insured.insured_sno = kdmpc.obgt_ins_seq
                                        LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM insurator_join
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                  ) ij ON ij.join_id = insured.id
      WHERE 1=1
            AND insured.deleted_dt IS NULL
            AND insured.del_yn = 'N'
            AND insured.id = ?
    `,

    selectInusredMfliDetailByInsuredId: `
      SELECT  insured.id
              , insured.refer_idx AS referId
              , insured.biz_type AS bizType
              , insured.insured_biz_no AS insuredBizNo
              , insured.insured_fran_nm AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , insured.insured_sno AS insuredSno
              , insured.insured_bzc_boon_cd AS insuredBzcBoonCd
              , insured.insured_bzc_boon_nm AS insuredBzcBoonNm
              , CASE WHEN insured.ins_com = '메리츠' THEN moci.obj_nm
                     WHEN insured.ins_com = 'KB손해보험' THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , insured.calc_amt AS calcAmt
              , insured.calc_unit_cd AS calcUnitCd
              , insured.calc_unit_nm AS calcUnitNm
              , insured.zip_cd AS zipCd
              , insured.new_plat_plc AS newPlatPlc
              , insured.new_plat_plc_etc AS newPlatPlcEtc
              , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     END AS address
              , insured.join_day AS joinDay
              , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
              , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
              , insured.bd_guaranteed_cost AS bdGuaranteedCost
              , insured.pt_guaranteed_cost AS ptGuaranteedCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , insured.apply_cost AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , insured.insured_owner_yn AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , insured.join_account AS joinAccount
              , insured.join_path AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , insured.prctr_no AS prctrNo
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0 
                     END AS premCmptSeqNo
              , insured.updated_dt AS updatedDt
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                     WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                     ELSE NULL
                     END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , insured.biz_member_seq_no AS bizMemberId
              , CASE WHEN ij.id IS NOT NULL THEN 'Y'
                     ELSE 'N' 
                     END AS insuratorYn
              , ij.team_id AS teamId
              , ij.job_pstn_id AS jobPositionId
              , insured.referer AS url
              , insured.insured_fran_nm AS sendNm
              , ipi.ins_prod_full_nm AS sendInsProdFullNm
      FROM tb_insured_mfli_info insured LEFT JOIN tb_meritz_mfli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                        LEFT JOIN tb_kb_mfli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                        LEFT JOIN     (
                                                      SELECT *
                                                      FROM ins_prod
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                            AND ins_prod_cd = 'mfli'
                                                      ) ipi ON ipi.strt_dt <= insured.created_dt
                                                            AND ipi.end_dt > insured.created_dt
                                        LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                        LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                 AND ipci.ins_com_id = ici.id
                                        LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                       AND ipt.strt_dt <= insured.created_dt
                                                                       AND ipt.end_dt > insured.created_dt
                                        LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                             AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                        LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                         AND insured.insured_sno = kdmpc.obgt_ins_seq
                                        LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM insurator_join
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                  ) ij ON ij.join_id = insured.id
      WHERE 1=1
            AND insured.deleted_dt IS NULL
            AND insured.del_yn = 'N'
            AND insured.id = ?
    `,

    selectInusredMfliDetailByReferId: `
      SELECT  insured.id
              , insured.refer_idx AS referId
              , insured.biz_type AS bizType
              , insured.insured_biz_no AS insuredBizNo
              , insured.insured_fran_nm AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , insured.insured_sno AS insuredSno
              , insured.insured_bzc_boon_cd AS insuredBzcBoonCd
              , insured.insured_bzc_boon_nm AS insuredBzcBoonNm
              , CASE WHEN insured.ins_com = '메리츠' THEN moci.obj_nm
                     WHEN insured.ins_com = 'KB손해보험' THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , insured.calc_amt AS calcAmt
              , insured.calc_unit_cd AS calcUnitCd
              , insured.calc_unit_nm AS calcUnitNm
              , insured.zip_cd AS zipCd
              , insured.new_plat_plc AS newPlatPlc
              , insured.new_plat_plc_etc AS newPlatPlcEtc
              , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     END AS address
              , insured.join_day AS joinDay
              , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
              , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
              , insured.bd_guaranteed_cost AS bdGuaranteedCost
              , insured.pt_guaranteed_cost AS ptGuaranteedCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , insured.apply_cost AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , insured.insured_owner_yn AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , insured.join_account AS joinAccount
              , insured.join_path AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , insured.prctr_no AS prctrNo
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0 
                     END AS premCmptSeqNo
              , insured.updated_dt AS updatedDt
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                     WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                     ELSE NULL
                     END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , insured.biz_member_seq_no AS bizMemberId
              , CASE WHEN ij.id IS NOT NULL THEN 'Y'
                     ELSE 'N' 
                     END AS insuratorYn
              , ij.team_id AS teamId
              , ij.job_pstn_id AS jobPositionId
              , insured.referer AS url
              , insured.insured_fran_nm AS sendNm
              , ipi.ins_prod_full_nm AS sendInsProdFullNm
      FROM tb_insured_mfli_info insured LEFT JOIN tb_meritz_mfli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                        LEFT JOIN tb_kb_mfli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                        LEFT JOIN     (
                                                      SELECT *
                                                      FROM ins_prod
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                            AND ins_prod_cd = 'mfli'
                                                      ) ipi ON ipi.strt_dt <= insured.created_dt
                                                            AND ipi.end_dt > insured.created_dt
                                        LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                        LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                 AND ipci.ins_com_id = ici.id
                                        LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                       AND ipt.strt_dt <= insured.created_dt
                                                                       AND ipt.end_dt > insured.created_dt
                                        LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                             AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                        LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                         AND insured.insured_sno = kdmpc.obgt_ins_seq
                                        LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM insurator_join
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                  ) ij ON ij.join_id = insured.id
      WHERE 1=1
            AND insured.deleted_dt IS NULL
            AND insured.del_yn = 'N'
            AND insured.refer_idx = ?
    `,

    selectInusredMfliDetailByJoinId: `
      SELECT  insured.id
              , insured.refer_idx AS referId
              , insured.biz_type AS bizType
              , insured.insured_biz_no AS insuredBizNo
              , insured.insured_fran_nm AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , insured.insured_sno AS insuredSno
              , insured.insured_bzc_boon_cd AS insuredBzcBoonCd
              , insured.insured_bzc_boon_nm AS insuredBzcBoonNm
              , CASE WHEN insured.ins_com = '메리츠' THEN moci.obj_nm
                     WHEN insured.ins_com = 'KB손해보험' THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , insured.calc_amt AS calcAmt
              , insured.calc_unit_cd AS calcUnitCd
              , insured.calc_unit_nm AS calcUnitNm
              , insured.zip_cd AS zipCd
              , insured.new_plat_plc AS newPlatPlc
              , insured.new_plat_plc_etc AS newPlatPlcEtc
              , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     END AS address
              , insured.join_day AS joinDay
              , CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm) AS insStartDt
              , CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm) AS insEndDt
              , insured.bd_guaranteed_cost AS bdGuaranteedCost
              , insured.pt_guaranteed_cost AS ptGuaranteedCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN insured.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , insured.apply_cost AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , insured.insured_owner_yn AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , insured.join_account AS joinAccount
              , insured.join_path AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , insured.prctr_no AS prctrNo
              , CASE WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0 
                     END AS premCmptSeqNo
              , insured.updated_dt AS updatedDt
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                     WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                     ELSE NULL
                     END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , insured.biz_member_seq_no AS bizMemberId
              , CASE WHEN ij.id IS NOT NULL THEN 'Y'
                     ELSE 'N' 
                     END AS insuratorYn
              , ij.team_id AS teamId
              , ij.job_pstn_id AS jobPositionId
              , insured.referer AS url
              , insured.insured_fran_nm AS sendNm
              , ipi.ins_prod_full_nm AS sendInsProdFullNm
      FROM tb_insured_mfli_info insured LEFT JOIN tb_meritz_mfli_obj_cd_info moci ON insured.insured_bzc_boon_cd = moci.obj_cd
                                        LEFT JOIN tb_kb_mfli_obj_cd_info koci ON insured.insured_bzc_boon_cd = koci.obj_cd
                                        LEFT JOIN     (
                                                      SELECT *
                                                      FROM ins_prod
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                            AND ins_prod_cd = 'mfli'
                                                      ) ipi ON ipi.strt_dt <= insured.created_dt
                                                            AND ipi.end_dt > insured.created_dt
                                        LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                        LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                 AND ipci.ins_com_id = ici.id
                                        LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_com_id = ipci.id
                                                                       AND ipt.strt_dt <= insured.created_dt
                                                                       AND ipt.end_dt > insured.created_dt
                                        LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON insured.prctr_no = mdmpc.prctr_no 
                                                                                             AND insured.insured_sno = mdmpc.dsst_cmps_sno
                                        LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON insured.prctr_no = kdmpc.apcno 
                                                                                         AND insured.insured_sno = kdmpc.obgt_ins_seq
                                        LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
                                        LEFT JOIN (
                                                  SELECT *
                                                  FROM insurator_join
                                                  WHERE 1=1
                                                        AND del_dt IS NULL
                                                  ) ij ON ij.join_id = insured.id
      WHERE 1=1
            AND insured.deleted_dt IS NULL
            AND insured.del_yn = 'N'
            AND insured.id = ?
    `,
    /* 가입내역 상세 조회 */
  },
  Insurator: {
    /* 설계내역 조회 */
    selectInsuratorPlanDliCntByPlannerId: `
      SELECT COUNT(*) AS totalCount
            , COUNT(CASE WHEN a.plannerStatus = '조회/설계' THEN 1 END) AS premCmptCount
            , COUNT(CASE WHEN a.plannerStatus = '견적제출' THEN 1 END) AS sendCount
            , COUNT(CASE WHEN a.plannerStatus = '계약완료' THEN 1 END) AS joinCount
            , COUNT(CASE WHEN a.plannerStatus IN ('만기/임박', '만기') THEN 1 END) AS expireCount
            , COUNT(CASE WHEN a.plannerStatus IN ('만기/임박', '만기') AND a.rejoinYn = 'N' THEN 1 END) AS expireBadgeCount
      FROM  (
            SELECT  CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.refer_idx
                           ELSE insured.refer_idx
                           END AS referId
                    , ij.plan_stts_cd AS planStatusCd
                    , CASE WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd = 'E' THEN '만기'
                           WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd IN ('N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
                    , ips.sort_no AS orderNo
                    , CASE WHEN ij.id in (40,41) THEN 'Y'
                           ELSE 'N'
                           END AS rejoinYn
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.created_dt
                           ELSE insured.created_dt
                           END AS sortDt
            FROM insurator_join ij  INNER JOIN  (
                                                SELECT *
                                                FROM insurator_planner
                                                WHERE 1=1
                                                      AND use_yn = 'Y'
                                                ) planner ON planner.id = ij.planner_id
                                    INNER JOIN  (
                                                SELECT *
                                                FROM insurator_ga
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ga ON ga.id = planner.ga_id
                                    INNER JOIN insurator_ins_prod_com ipci ON ij.ins_prod_com_id = ipci.id
                                    INNER JOIN 	(
                                                SELECT *
                                                FROM ins_prod
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                      AND ins_prod_cd = 'dli'
                                                ) ipi ON ipci.ins_prod_id = ipi.id
                                                         AND ipi.strt_dt <= ij.crt_dt
                                                         AND ipi.end_dt > ij.crt_dt
                                    LEFT JOIN 	(
                                                SELECT *
                                                FROM insurator_plan_stts
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ips on ips.plan_stts_cd = ij.plan_stts_cd
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_dli_info_tmp
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) tmp ON tmp.id = ij.tmp_id
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_dli_info
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) insured ON insured.id = ij.join_id
            WHERE 1=1
                  AND ij.del_dt IS NULL
                  AND ij.planner_id IN (%%plannerIds%%)
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanDliListByPlannerId: `
      SELECT *
      FROM  (
            SELECT  insured.id AS joinId
                    , tmp.id AS tmpId
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.refer_idx
                           ELSE insured.refer_idx
                           END AS referId
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.biz_type
                           ELSE insured.biz_type
                           END AS bizType
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_biz_no
                           ELSE insured.insured_biz_no
                           END AS insuredBizNo
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_fran_nm
                           ELSE insured.insured_fran_nm
                           END AS insuredFranNm
                    , insured.insured_nm AS insuredNm
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') AND tmp.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(tmp.new_plat_plc, ' ', tmp.new_plat_plc_etc), '( ){2,}', ' ')
                           WHEN ij.plan_stts_cd IN ('I','P','Q') THEN REGEXP_REPLACE(tmp.new_plat_plc, '( ){2,}', ' ')
                           WHEN ij.plan_stts_cd NOT IN ('I','P','Q') AND insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                           WHEN ij.plan_stts_cd NOT IN ('I','P','Q') THEN REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                           ELSE ''
                           END AS address
                    , insured.join_day AS joinDay
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_start_dt, 10), ' ', tmp.ins_start_hm)
                           ELSE CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm)
                           END AS insStartDt
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_end_dt, 10), ' ', tmp.ins_end_hm)
                           ELSE CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm)
                           END AS insEndDt
                    , insured.join_ck AS joinCk
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.ins_com
                           ELSE insured.ins_com
                           END AS insCom
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                           WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                           ELSE NULL
                           END AS ctrtType
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , ij.plan_stts_cd AS planStatusCd
                    , CASE WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd = 'E' THEN '만기'
                           WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd IN ('N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
                    , ips.sort_no AS orderNo
                    , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                        CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                            ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                            END
                                                                        )
                                                                    , NOW())
                          ELSE NULL 
                          END AS insDday
                    , CASE WHEN ij.id in (40,41) THEN 'Y'
                           ELSE 'N'
                           END AS rejoinYn
                    , ij.crt_dt AS createdDt
                    , ij.updt_dt AS updatedDt
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.created_dt
                           ELSE insured.created_dt
                           END AS sortDt
                    , tmp.created_dt AS premCmptDt -- 조회/설계일
                    , insured.created_dt AS joinDt -- 계약완료일
            FROM insurator_join ij  INNER JOIN  (
                                                SELECT *
                                                FROM insurator_planner
                                                WHERE 1=1
                                                      AND use_yn = 'Y'
                                                ) planner ON planner.id = ij.planner_id
                                    INNER JOIN insurator_ins_prod_com ipci ON ij.ins_prod_com_id = ipci.id
                                    INNER JOIN 	(
                                                SELECT *
                                                FROM ins_prod
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                      AND ins_prod_cd = 'dli'
                                                ) ipi ON ipci.ins_prod_id = ipi.id
                                                         AND ipi.strt_dt <= ij.crt_dt
                                                         AND ipi.end_dt > ij.crt_dt
                                    LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                                   AND planner_fee.ins_prod_com_id = ipci.id
                                    LEFT JOIN 	(
                                                SELECT *
                                                FROM insurator_plan_stts
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ips on ips.plan_stts_cd = ij.plan_stts_cd
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_dli_info_tmp
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) tmp ON tmp.id = ij.tmp_id
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_dli_info
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) insured ON insured.id = ij.join_id
            WHERE 1=1
                  AND ij.del_dt IS NULL
                  AND ij.planner_id IN (%%plannerIds%%)
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanMfliCntByPlannerId: `
      SELECT COUNT(*) AS totalCount
            , COUNT(CASE WHEN a.plannerStatus = '조회/설계' THEN 1 END) AS premCmptCount
            , COUNT(CASE WHEN a.plannerStatus = '견적제출' THEN 1 END) AS sendCount
            , COUNT(CASE WHEN a.plannerStatus = '계약완료' THEN 1 END) AS joinCount
            , COUNT(CASE WHEN a.plannerStatus IN ('만기/임박', '만기') THEN 1 END) AS expireCount
            , COUNT(CASE WHEN a.plannerStatus IN ('만기/임박', '만기') AND a.rejoinYn = 'N' THEN 1 END) AS expireBadgeCount
      FROM  (
            SELECT  CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.refer_idx
                           ELSE insured.refer_idx
                           END AS referId
                    , ij.plan_stts_cd AS planStatusCd
                    , CASE WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd = 'E' THEN '만기'
                           WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd IN ('N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
                    , ips.sort_no AS orderNo
                    , CASE WHEN ij.id in (40,41) THEN 'Y'
                           ELSE 'N'
                           END AS rejoinYn
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.created_dt
                           ELSE insured.created_dt
                           END AS sortDt
            FROM insurator_join ij  INNER JOIN  (
                                                SELECT *
                                                FROM insurator_planner
                                                WHERE 1=1
                                                      AND use_yn = 'Y'
                                                ) planner ON planner.id = ij.planner_id
                                    INNER JOIN  (
                                                SELECT *
                                                FROM insurator_ga
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ga ON ga.id = planner.ga_id
                                    INNER JOIN insurator_ins_prod_com ipci ON ij.ins_prod_com_id = ipci.id
                                    INNER JOIN 	(
                                                SELECT *
                                                FROM ins_prod
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                      AND ins_prod_cd = 'mfli'
                                                ) ipi ON ipci.ins_prod_id = ipi.id
                                                         AND ipi.strt_dt <= ij.crt_dt
                                                         AND ipi.end_dt > ij.crt_dt
                                    LEFT JOIN 	(
                                                SELECT *
                                                FROM insurator_plan_stts
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ips on ips.plan_stts_cd = ij.plan_stts_cd
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_mfli_info_tmp
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) tmp ON tmp.id = ij.tmp_id
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_mfli_info
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) insured ON insured.id = ij.join_id
            WHERE 1=1
                  AND ij.del_dt IS NULL
                  AND ij.planner_id IN (%%plannerIds%%)
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanMfliListByPlannerId: `
      SELECT *
      FROM  (
            SELECT  insured.id AS joinId
                    , tmp.id AS tmpId
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.refer_idx
                           ELSE insured.refer_idx
                           END AS referId
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.biz_type
                           ELSE insured.biz_type
                           END AS bizType
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_biz_no
                           ELSE insured.insured_biz_no
                           END AS insuredBizNo
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_fran_nm
                           ELSE insured.insured_fran_nm
                           END AS insuredFranNm
                    , insured.insured_nm AS insuredNm
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') AND tmp.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(tmp.new_plat_plc, ' ', tmp.new_plat_plc_etc), '( ){2,}', ' ')
                           WHEN ij.plan_stts_cd IN ('I','P','Q') THEN REGEXP_REPLACE(tmp.new_plat_plc, '( ){2,}', ' ')
                           WHEN ij.plan_stts_cd NOT IN ('I','P','Q') AND insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                           WHEN ij.plan_stts_cd NOT IN ('I','P','Q') THEN REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                           ELSE ''
                           END AS address
                    , insured.join_day AS joinDay
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_start_dt, 10), ' ', tmp.ins_start_hm)
                           ELSE CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm)
                           END AS insStartDt
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_end_dt, 10), ' ', tmp.ins_end_hm)
                           ELSE CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm)
                           END AS insEndDt
                    , insured.join_ck AS joinCk
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.ins_com
                           ELSE insured.ins_com
                           END AS insCom
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                           WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                           ELSE NULL
                           END AS ctrtType
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , ij.plan_stts_cd AS planStatusCd
                    , CASE WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd = 'E' THEN '만기'
                           WHEN insured.join_ck IN ('Y', 'X') AND ij.plan_stts_cd IN ('N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
                    , ips.sort_no AS orderNo
                    , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                        CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                            ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                            END
                                                                        )
                                                                    , NOW())
                          ELSE NULL 
                          END AS insDday
                    , CASE WHEN ij.id in (40,41) THEN 'Y'
                           ELSE 'N'
                           END AS rejoinYn
                    , ij.crt_dt AS createdDt
                    , ij.updt_dt AS updatedDt
                    , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.created_dt
                           ELSE insured.created_dt
                           END AS sortDt
                    , tmp.created_dt AS premCmptDt -- 조회/설계일
                    , insured.created_dt AS joinDt -- 계약완료일
            FROM insurator_join ij  INNER JOIN  (
                                                SELECT *
                                                FROM insurator_planner
                                                WHERE 1=1
                                                      AND use_yn = 'Y'
                                                ) planner ON planner.id = ij.planner_id
                                    INNER JOIN insurator_ins_prod_com ipci ON ij.ins_prod_com_id = ipci.id
                                    INNER JOIN 	(
                                                SELECT *
                                                FROM ins_prod
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                      AND ins_prod_cd = 'mfli'
                                                ) ipi ON ipci.ins_prod_id = ipi.id
                                                         AND ipi.strt_dt <= ij.crt_dt
                                                         AND ipi.end_dt > ij.crt_dt
                                    LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                                   AND planner_fee.ins_prod_com_id = ipci.id
                                    LEFT JOIN 	(
                                                SELECT *
                                                FROM insurator_plan_stts
                                                WHERE 1=1
                                                      AND del_dt IS NULL
                                                ) ips on ips.plan_stts_cd = ij.plan_stts_cd
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_mfli_info_tmp
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) tmp ON tmp.id = ij.tmp_id
                                    LEFT JOIN   (
                                                SELECT *
                                                FROM tb_insured_mfli_info
                                                WHERE 1=1
                                                      AND del_yn = 'N'
                                                      AND deleted_dt IS NULL
                                                ) insured ON insured.id = ij.join_id
            WHERE 1=1
                  AND ij.del_dt IS NULL
                  AND ij.planner_id IN (%%plannerIds%%)
      ) a
      WHERE %%WHERE2%%
    `,
    /* 설계내역 조회 */

    /* 설계내역 상세 조회 */
    selectInsuratorPlanDliDetailByReferId: `
      SELECT  insured.id AS joinId
              , tmp.id AS tmpId
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.refer_idx
                     ELSE insured.refer_idx
                     END AS referId
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.biz_type
                     ELSE insured.biz_type
                     END AS bizType
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_biz_no
                     ELSE insured.insured_biz_no
                     END AS insuredBizNo
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_fran_nm
                     ELSE insured.insured_fran_nm
                     END AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_sno
                     ELSE insured.insured_sno
                     END AS insuredSno
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_cd
                     ELSE insured.insured_bzc_boon_cd
                     END AS insuredBzcBoonCd
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_nm
                     ELSE insured.insured_bzc_boon_nm
                     END AS insuredBzcBoonNm
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN moci.obj_nm
                     WHEN (tmp.ins_com = 'KB손해보험' OR insured.ins_com = 'KB손해보험') THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.calc_amt
                     ELSE insured.calc_amt
                     END AS calcAmt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.calc_unit_cd
                     ELSE insured.calc_unit_cd
                     END AS calcUnitCd
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.calc_unit_nm
                     ELSE insured.calc_unit_nm
                     END AS calcUnitNm
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.zip_cd
                     ELSE insured.zip_cd
                     END AS zipCd
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.new_plat_plc
                     ELSE insured.new_plat_plc
                     END AS newPlatPlc
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.new_plat_plc_etc
                     ELSE insured.new_plat_plc_etc
                     END AS newPlatPlcEtc
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') AND tmp.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(tmp.new_plat_plc, ' ', tmp.new_plat_plc_etc), '( ){2,}', ' ')
                     WHEN ij.plan_stts_cd IN ('I','P','Q') THEN REGEXP_REPLACE(tmp.new_plat_plc, '( ){2,}', ' ')
                     WHEN ij.plan_stts_cd NOT IN ('I','P','Q') AND insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     WHEN ij.plan_stts_cd NOT IN ('I','P','Q') THEN REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     ELSE ''
                     END AS address
              , insured.join_day AS joinDay
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_start_dt, 10), ' ', tmp.ins_start_hm)
                     ELSE CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm)
                     END AS insStartDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_end_dt, 10), ' ', tmp.ins_end_hm)
                     ELSE CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm)
                     END AS insEndDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.bd_guaranteed_cost
                     ELSE insured.bd_guaranteed_cost
                     END AS bdGuaranteedCost
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.pt_guaranteed_cost
                     ELSE insured.pt_guaranteed_cost
                     END AS ptGuaranteedCost
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN (tmp.ins_com = 'KB손해보험' OR insured.ins_com = 'KB손해보험') THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN (tmp.ins_com = 'KB손해보험' OR insured.ins_com = 'KB손해보험') THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.apply_cost
                     ELSE insured.apply_cost
                     END AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.acc_yn
                     WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_owner_yn
                     ELSE insured.insured_owner_yn
                     END AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.join_account
                     ELSE insured.join_account
                     END AS joinAccount
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.join_path
                     ELSE insured.join_path
                     END AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prctr_no
                     ELSE insured.prctr_no
                     END AS prctrNo
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prem_cmpt_log_id
                     WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0
                     END AS premCmptSeqNo
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                    WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                    ELSE NULL
                    END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , planner.user_nm AS plannerName
              , planner.username AS plannerTelNo
              , planner.user_eml AS plannerEmail
              , ga.ga_nm AS plannerGa
              , IFNULL(ij.fee_amt, 10) AS feeAmt -- 나의 계약 수수료
              , IFNULL(ij.fee_unit, 'percent') AS feeUnit -- 나의 계약 수수료 단위
              , CASE WHEN ij.fee_amt IS NULL OR ij.fee_unit IS NULL THEN 0
                     WHEN ij.fee_unit = 'percent' THEN TRUNCATE(IFNULL(insured.apply_cost, tmp.apply_cost) * ij.fee_amt / 100, 0)
                     WHEN ij.fee_unit = 'won' THEN ij.fee_unit
                     ELSE 0
                     END AS feeCost -- 나의 수익
              , ij.plan_stts_cd AS planStatusCd
              , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                     WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                     WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                      ELSE '조회/설계' 
                      END AS plannerStatus
              , ips.sort_no AS orderNo
              , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                  CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                      ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                      END
                                                                  )
                                                              , NOW())
                    ELSE NULL 
                    END AS insDday
              , ief.file_url AS fileUrl
              , '' AS joinUrl
              , CASE WHEN ij.id in (40,41) THEN 'Y'
                     ELSE 'N'
                     END AS rejoinYn
              , insured.updated_dt AS updatedDt
              , ij.crt_dt AS createdDt
              , ij.updt_dt AS updatedDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.created_dt
                           ELSE insured.created_dt
                           END AS sortDt
              , tmp.created_dt AS premCmptDt -- 조회/설계일
              , ief.send_dt AS sendDt -- 견적제출일
              , insured.created_dt AS joinDt -- 계약완료일
      FROM insurator_join ij  LEFT JOIN (
                                        SELECT *
                                        FROM insurator_estimate_file
                                        WHERE 1=1
                                              AND del_dt IS NULL
                                        GROUP BY insurator_join_id
                                        ) ief ON ief.insurator_join_id = ij.id
                              INNER JOIN  (
                                          SELECT *
                                          FROM insurator_planner
                                          WHERE 1=1
                                                AND use_yn = 'Y'
                                          ) planner ON planner.id = ij.planner_id
                              INNER JOIN  (
                                          SELECT *
                                          FROM insurator_ga
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                          ) ga ON ga.id = planner.ga_id
                              INNER JOIN insurator_ins_prod_com ipci ON ij.ins_prod_com_id = ipci.id
                              INNER JOIN 	(
                                          SELECT *
                                          FROM ins_prod
                                           WHERE 1=1
                                                AND del_dt IS NULL
                                                AND ins_prod_cd = 'dli'
                                          ) ipi ON ipci.ins_prod_id = ipi.id
                                                   AND ipi.strt_dt <= ij.crt_dt
                                                   AND ipi.end_dt > ij.crt_dt
                              INNER JOIN ins_com ici ON ipci.ins_com_id = ici.id
                              LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                             AND planner_fee.ins_prod_com_id = ipci.id
                              LEFT JOIN 	(
                                          SELECT *
                                          FROM insurator_plan_stts
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                          ) ips on ips.plan_stts_cd = ij.plan_stts_cd
                              LEFT JOIN   (
                                          SELECT *
                                          FROM tb_insured_dli_info_tmp
                                          WHERE 1=1
                                                AND del_yn = 'N'
                                                AND deleted_dt IS NULL
                                          ) tmp ON tmp.id = ij.tmp_id
                              LEFT JOIN   (
                                          SELECT *
                                          FROM tb_insured_dli_info
                                          WHERE 1=1
                                                AND del_yn = 'N'
                                                AND deleted_dt IS NULL
                                          ) insured ON insured.id = ij.join_id
                              LEFT JOIN tb_meritz_dli_obj_cd_info moci ON moci.obj_cd = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_cd
                                                                                             ELSE insured.insured_bzc_boon_cd
                                                                                             END
                              LEFT JOIN tb_kb_dli_obj_cd_info koci ON koci.obj_cd = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_cd
                                                                                         ELSE insured.insured_bzc_boon_cd
                                                                                         END
                              LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_id = ipci.ins_prod_id
                                                             AND ipt.ins_com_id = ipci.ins_com_id
                                                             AND ipt.strt_dt <= ij.crt_dt
                                                             AND ipt.end_dt > ij.crt_dt
                              LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON mdmpc.prctr_no = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prctr_no
                                                                                                         ELSE insured.prctr_no
                                                                                                         END
                                                                                   AND mdmpc.dsst_cmps_sno = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_sno
                                                                                                                  ELSE insured.insured_sno
                                                                                                                  END
                              LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON kdmpc.apcno = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prctr_no
                                                                                                  ELSE insured.prctr_no
                                                                                                  END
                                                                               AND kdmpc.obgt_ins_seq = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_sno
                                                                                                             ELSE insured.insured_sno
                                                                                                             END
                              LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
      WHERE 1=1
            AND ij.del_dt IS NULL
            AND %%WHERE plannerIds%%
            AND (insured.refer_idx = ? OR ij.refer_id = ?)
    `,

    selectInsuratorPlanMfliDetailByReferId: `
      SELECT  insured.id AS joinId
              , tmp.id AS tmpId
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.refer_idx
                     ELSE insured.refer_idx
                     END AS referId
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.biz_type
                     ELSE insured.biz_type
                     END AS bizType
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_biz_no
                     ELSE insured.insured_biz_no
                     END AS insuredBizNo
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_fran_nm
                     ELSE insured.insured_fran_nm
                     END AS insuredFranNm
              , insured.insured_nm AS insuredNm
              , insured.insured_tel_no AS insuredTelNo
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_sno
                     ELSE insured.insured_sno
                     END AS insuredSno
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_cd
                     ELSE insured.insured_bzc_boon_cd
                     END AS insuredBzcBoonCd
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_nm
                     ELSE insured.insured_bzc_boon_nm
                     END AS insuredBzcBoonNm
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN moci.obj_nm
                     WHEN (tmp.ins_com = 'KB손해보험' OR insured.ins_com = 'KB손해보험') THEN koci.obj_nm
                     END AS insuredBzcBoonObjNm
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.calc_amt
                     ELSE insured.calc_amt
                     END AS calcAmt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.calc_unit_cd
                     ELSE insured.calc_unit_cd
                     END AS calcUnitCd
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.calc_unit_nm
                     ELSE insured.calc_unit_nm
                     END AS calcUnitNm
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.zip_cd
                     ELSE insured.zip_cd
                     END AS zipCd
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.new_plat_plc
                     ELSE insured.new_plat_plc
                     END AS newPlatPlc
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.new_plat_plc_etc
                     ELSE insured.new_plat_plc_etc
                     END AS newPlatPlcEtc
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') AND tmp.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(tmp.new_plat_plc, ' ', tmp.new_plat_plc_etc), '( ){2,}', ' ')
                     WHEN ij.plan_stts_cd IN ('I','P','Q') THEN REGEXP_REPLACE(tmp.new_plat_plc, '( ){2,}', ' ')
                     WHEN ij.plan_stts_cd NOT IN ('I','P','Q') AND insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
                     WHEN ij.plan_stts_cd NOT IN ('I','P','Q') THEN REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
                     ELSE ''
                     END AS address
              , insured.join_day AS joinDay
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_start_dt, 10), ' ', tmp.ins_start_hm)
                     ELSE CONCAT(LEFT(insured.ins_start_dt, 10), ' ', insured.ins_start_hm)
                     END AS insStartDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN CONCAT(LEFT(tmp.ins_end_dt, 10), ' ', tmp.ins_end_hm)
                     ELSE CONCAT(LEFT(insured.ins_end_dt, 10), ' ', insured.ins_end_hm)
                     END AS insEndDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.bd_guaranteed_cost
                     ELSE insured.bd_guaranteed_cost
                     END AS bdGuaranteedCost
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.pt_guaranteed_cost
                     ELSE insured.pt_guaranteed_cost
                     END AS ptGuaranteedCost
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                     WHEN (tmp.ins_com = 'KB손해보험' OR insured.ins_com = 'KB손해보험') THEN kdmpc.bdyinj_prem
                     END AS bdInsCost
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                     WHEN (tmp.ins_com = 'KB손해보험' OR insured.ins_com = 'KB손해보험') THEN kdmpc.ppdm_prem
                     END AS ptInsCost
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.apply_cost
                     ELSE insured.apply_cost
                     END AS applyCost
              , insured.ins_stock_no AS insStockNo
              , insured.join_ck AS joinCk
              , CASE WHEN (tmp.ins_com = '메리츠' OR insured.ins_com = '메리츠') THEN mdmpc.agr_inf_con
                     ELSE NULL 
                     END AS agrInfCon
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.acc_yn
                     WHEN insured.acc_yn IS NOT NULL THEN insured.acc_yn
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '1' THEN 'Y'
                     WHEN insured.ins_com = '메리츠' AND SUBSTR(mdmpc.agr_inf_con, 8, 1) = '2' THEN 'N'
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.acc_yn
                     ELSE NULL 
                     END AS accidentYn
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_owner_yn
                     ELSE insured.insured_owner_yn
                     END AS insuredOwnerFlag
              , insured.pay_status AS payStatus
              , insured.pay_method AS payMethod
              , insured.pay_dt AS payDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.join_account
                     ELSE insured.join_account
                     END AS joinAccount
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.join_path
                     ELSE insured.join_path
                     END AS joinPath
              , CASE WHEN insured.cert_logs_seq_no IS NULL THEN 'N'
                     WHEN insured.cert_logs_seq_no = 0 THEN 'N'
                     ELSE 'Y' 
                     END AS certStatus
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prctr_no
                     ELSE insured.prctr_no
                     END AS prctrNo
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prem_cmpt_log_id
                     WHEN insured.ins_com = '메리츠' THEN mdmpc.seq_no
                     WHEN insured.ins_com = 'KB손해보험' THEN kdmpc.seq_no
                     ELSE 0
                     END AS premCmptSeqNo
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , insured.ins_com AS insCom
              , ici.ins_com_full_nm AS insComFullNm
              , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                    WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                    ELSE NULL
                    END AS ctrtType
              , ipci.ins_com_api_yn AS insComApiYn
              , ipt.trms_short_url AS termsUrl
              , planner.user_nm AS plannerName
              , planner.username AS plannerTelNo
              , planner.user_eml AS plannerEmail
              , ga.ga_nm AS plannerGa
              , IFNULL(ij.fee_amt, 10) AS feeAmt -- 나의 계약 수수료
              , IFNULL(ij.fee_unit, 'percent') AS feeUnit -- 나의 계약 수수료 단위
              , CASE WHEN ij.fee_amt IS NULL OR ij.fee_unit IS NULL THEN 0
                     WHEN ij.fee_unit = 'percent' THEN TRUNCATE(IFNULL(insured.apply_cost, tmp.apply_cost) * ij.fee_amt / 100, 0)
                     WHEN ij.fee_unit = 'won' THEN ij.fee_unit
                     ELSE 0
                     END AS feeCost -- 나의 수익
              , ij.plan_stts_cd AS planStatusCd
              , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                     WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                     WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                      ELSE '조회/설계' 
                      END AS plannerStatus
              , ips.sort_no AS orderNo
              , CASE WHEN insured.join_ck = 'Y' THEN DATEDIFF(DATE( 
                                                                  CASE WHEN insured.ins_end_hm = '24:00' THEN LEFT(DATE_ADD(insured.ins_end_dt, INTERVAL 1 DAY), 10)
                                                                      ELSE CONCAT(insured.ins_end_dt, ' ', insured.ins_end_hm)
                                                                      END
                                                                  )
                                                              , NOW())
                    ELSE NULL 
                    END AS insDday
              , ief.file_url AS fileUrl
              , '' AS joinUrl
              , CASE WHEN ij.id in (40,41) THEN 'Y'
                     ELSE 'N'
                     END AS rejoinYn
              , insured.updated_dt AS updatedDt
              , ij.crt_dt AS createdDt
              , ij.updt_dt AS updatedDt
              , CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.created_dt
                           ELSE insured.created_dt
                           END AS sortDt
              , tmp.created_dt AS premCmptDt -- 조회/설계일
              , ief.send_dt AS sendDt -- 견적제출일
              , insured.created_dt AS joinDt -- 계약완료일
      FROM insurator_join ij  LEFT JOIN insurator_estimate_file ief ON ief.insurator_join_id = ij.id
                              INNER JOIN  (
                                          SELECT *
                                          FROM insurator_planner
                                          WHERE 1=1
                                                AND use_yn = 'Y'
                                          ) planner ON planner.id = ij.planner_id
                              INNER JOIN  (
                                          SELECT *
                                          FROM insurator_ga
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                          ) ga ON ga.id = planner.ga_id
                              INNER JOIN insurator_ins_prod_com ipci ON ij.ins_prod_com_id = ipci.id
                              INNER JOIN 	(
                                          SELECT *
                                          FROM ins_prod
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                                AND ins_prod_cd = 'mfli'
                                          ) ipi ON ipci.ins_prod_id = ipi.id
                                                   AND ipi.strt_dt <= ij.crt_dt
                                                   AND ipi.end_dt > ij.crt_dt
                              INNER JOIN ins_com ici ON ipci.ins_com_id = ici.id
                              LEFT JOIN insurator_planner_fee planner_fee ON planner_fee.planner_id = planner.id
                                                                             AND planner_fee.ins_prod_com_id = ipci.id
                              LEFT JOIN 	(
                                          SELECT *
                                          FROM insurator_plan_stts
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                          ) ips on ips.plan_stts_cd = ij.plan_stts_cd
                              LEFT JOIN   (
                                          SELECT *
                                          FROM tb_insured_mfli_info_tmp
                                          WHERE 1=1
                                                AND del_yn = 'N'
                                                AND deleted_dt IS NULL
                                          ) tmp ON tmp.id = ij.tmp_id
                              LEFT JOIN   (
                                          SELECT *
                                          FROM tb_insured_mfli_info
                                          WHERE 1=1
                                                AND del_yn = 'N'
                                                AND deleted_dt IS NULL
                                          ) insured ON insured.id = ij.join_id
                              LEFT JOIN tb_meritz_mfli_obj_cd_info moci ON moci.obj_cd = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_cd
                                                                                              ELSE insured.insured_bzc_boon_cd
                                                                                              END
                              LEFT JOIN tb_kb_mfli_obj_cd_info koci ON koci.obj_cd = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_bzc_boon_cd
                                                                                          ELSE insured.insured_bzc_boon_cd
                                                                                          END
                              LEFT JOIN ins_prod_trms ipt ON ipt.ins_prod_id = ipci.ins_prod_id
                                                             AND ipt.ins_com_id = ipci.ins_com_id
                                                             AND ipt.strt_dt <= ij.crt_dt
                                                             AND ipt.end_dt > ij.crt_dt
                              LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON mdmpc.prctr_no = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prctr_no
                                                                                                               ELSE insured.prctr_no
                                                                                                               END
                                                                                   AND mdmpc.dsst_cmps_sno = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_sno
                                                                                                                  ELSE insured.insured_sno
                                                                                                                  END
                              LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON kdmpc.apcno = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.prctr_no
                                                                                                  ELSE insured.prctr_no
                                                                                                  END
                                                                               AND kdmpc.obgt_ins_seq = CASE WHEN ij.plan_stts_cd IN ('I','P','Q') THEN tmp.insured_sno
                                                                                                             ELSE insured.insured_sno
                                                                                                             END
                              LEFT JOIN tb_nicepay_payment_logs npl ON insured.pay_logs_seq_no = npl.seq_no
      WHERE 1=1
            AND ij.del_dt IS NULL
            AND %%WHERE plannerIds%%
            AND (insured.refer_idx = ? OR ij.refer_id = ?)
    `,

    /* 설계내역 상세 조회 */

    /* 계약수수료 내역 조회 */
    selectInsuratorPlanFeeDliListByPlannerId: `
      SELECT *
      FROM  (
            SELECT  insured.id AS insuredId
                    , insured.refer_idx AS referId
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                          WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                          ELSE NULL
                          END AS insuredType
                    , insured.insured_biz_no AS insuredBizNo
  --                   , insured.insured_nm AS insuredNm
  --                   , insured.insured_fran_nm AS insuredFranNm
                    , CASE WHEN insured.biz_type = 'N' THEN insured.insured_nm
                           ELSE CONCAT(insured.insured_nm, '(', insured.insured_fran_nm, ')')
                           END AS insuredNm
                    , ij.plan_stts_cd AS planStatusCd
--                     , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
--                            ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
--                            END AS address
  --                   , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN '만기/임박'
  --                          WHEN insured.join_ck = 'Y' THEN '계약완료'
  --                          WHEN tpef.send_yn = 'Y' THEN '견적제출'
  --                          ELSE '조회/설계' 
  --                          END AS planner_status
                    , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
                    , insured.apply_cost AS totalInsCost
                    , insured.created_dt AS joinDt -- 계약완료일
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , planner.user_eml AS plannerEmail
                    , planner.ga_nm AS plannerGa
                    , ij.planner_id AS originPlannerId
                    , ij.ins_prod_com_id AS insProdComId
                    , ij.fee_amt AS feeAmt
                    , ij.fee_unit AS feeUnit
                    , ij.id AS insuratorJoinId
            FROM tb_insured_dli_info insured  LEFT JOIN (
                                                        SELECT *
                                                        FROM ins_prod
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                              AND ins_prod_cd = 'dli'
                                                        ) ipi ON ipi.strt_dt <= insured.created_dt
                                                                AND ipi.end_dt > insured.created_dt
                                              LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                              LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                       AND ipci.ins_com_id = ici.id
                                              INNER JOIN  (
                                                          SELECT *
                                                          FROM insurator_join
                                                          WHERE 1=1
                                                                AND del_dt IS NULL
                                                                AND planner_id IN (%%plannerIds%%)
                                                          ) ij ON ij.ins_prod_com_id = ipci.id
                                                                  AND ij.join_id = insured.id
                                              INNER JOIN  (
                                                          SELECT  ip.*
                                                                  , ig.ga_nm
                                                                  , ipf.ins_prod_com_id
                                                                  , ipf.sell_yn
                                                                  , ipf.fee_amt AS default_fee_amt
                                                                  , ipf.fee_unit AS default_fee_unit
                                                          FROM insurator_planner ip LEFT JOIN (
                                                                                              SELECT *
                                                                                              FROM insurator_ga
                                                                                              WHERE 1=1
                                                                                                    AND del_dt IS NULL
                                                                                              ) ig ON ig.id = ip.ga_id
                                                                                    LEFT JOIN (
                                                                                              SELECT *
                                                                                              FROM insurator_planner_fee
                                                                                              WHERE 1=1
                                                                                                    AND del_dt IS NULL
                                                                                      ) ipf ON ipf.planner_id = ip.id
                                                          WHERE 1=1
                                                          ) planner ON planner.id = ij.planner_id
                                                                      AND planner.ins_prod_com_id = ipci.id
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM insurator_plan_stts
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                        ) ips on ips.plan_stts_cd = ij.plan_stts_cd
            WHERE 1=1
                  AND insured.deleted_dt IS NULL
                  AND insured.del_yn = 'N'
                  AND insured.join_ck IN ('Y','X')
      ) a
      WHERE %%WHERE2%%
    `,

    selectInsuratorPlanFeeMfliListByPlannerId: `
      SELECT *
      FROM  (
            SELECT  insured.id AS insuredId
                    , insured.refer_idx AS referId
                    , ipi.ins_prod_cd AS insProdCd
                    , ipi.ins_prod_nm AS insProdNm
                    , ipi.ins_prod_full_nm AS insProdFullNm
                    , CASE WHEN ipci.ctrt_type = 'G' THEN '단체계약'
                          WHEN ipci.ctrt_type = 'I' THEN '개별계약'
                          ELSE NULL
                          END AS insuredType
                    , insured.insured_biz_no AS insuredBizNo
  --                   , insured.insured_nm AS insuredNm
  --                   , insured.insured_fran_nm AS insuredFranNm
                    , CASE WHEN insured.biz_type = 'N' THEN insured.insured_nm
                           ELSE CONCAT(insured.insured_nm, '(', insured.insured_fran_nm, ')')
                           END AS insuredNm
                    , ij.plan_stts_cd AS planStatusCd
--                     , CASE WHEN insured.new_plat_plc_etc IS NOT NULL THEN REGEXP_REPLACE(CONCAT(insured.new_plat_plc, ' ', insured.new_plat_plc_etc), '( ){2,}', ' ')
--                            ELSE REGEXP_REPLACE(insured.new_plat_plc, '( ){2,}', ' ')
--                            END AS address
  --                   , CASE WHEN insured.join_ck = 'Y' AND DATEDIFF(DATE(CONCAT(DATE_FORMAT(insured.ins_end_dt, '%Y-%m-%d'), ' 16:00')), NOW()) <= 30 THEN '만기/임박'
  --                          WHEN insured.join_ck = 'Y' THEN '계약완료'
  --                          WHEN tpef.send_yn = 'Y' THEN '견적제출'
  --                          ELSE '조회/설계' 
  --                          END AS planner_status
                    , CASE WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('E', 'N') THEN '만기/임박'
                           WHEN insured.join_ck = 'Y' AND ij.plan_stts_cd IN ('C') THEN '계약완료'
                           WHEN ij.plan_stts_cd IN ('Q') THEN '견적제출'
                           ELSE '조회/설계' 
                           END AS plannerStatus
                    , insured.apply_cost AS totalInsCost
                    , insured.created_dt AS joinDt -- 계약완료일
                    , planner.user_nm AS plannerName
                    , planner.username AS plannerTelNo
                    , planner.user_eml AS plannerEmail
                    , planner.ga_nm AS plannerGa
                    , ij.planner_id AS originPlannerId
                    , ij.ins_prod_com_id AS insProdComId
                    , ij.fee_amt AS feeAmt
                    , ij.fee_unit AS feeUnit
                    , ij.id AS insuratorJoinId
            FROM tb_insured_mfli_info insured LEFT JOIN (
                                                        SELECT *
                                                        FROM ins_prod
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                              AND ins_prod_cd = 'mfli'
                                                        ) ipi ON ipi.strt_dt <= insured.created_dt
                                                                AND ipi.end_dt > insured.created_dt
                                              LEFT JOIN ins_com ici ON insured.ins_com = ici.ins_com_nm
                                              LEFT JOIN insurator_ins_prod_com ipci ON ipci.ins_prod_id = ipi.id
                                                                                       AND ipci.ins_com_id = ici.id
                                              INNER JOIN  (
                                                          SELECT *
                                                          FROM insurator_join
                                                          WHERE 1=1
                                                                AND del_dt IS NULL
                                                                AND planner_id IN (%%plannerIds%%)
                                                          ) ij ON ij.ins_prod_com_id = ipci.id
                                                                  AND ij.join_id = insured.id
                                              INNER JOIN  (
                                                          SELECT  ip.*
                                                                  , ig.ga_nm
                                                                  , ipf.ins_prod_com_id
                                                                  , ipf.sell_yn
                                                                  , ipf.fee_amt AS default_fee_amt
                                                                  , ipf.fee_unit AS default_fee_unit
                                                          FROM insurator_planner ip LEFT JOIN (
                                                                                              SELECT *
                                                                                              FROM insurator_ga
                                                                                              WHERE 1=1
                                                                                                    AND del_dt IS NULL
                                                                                              ) ig ON ig.id = ip.ga_id
                                                                                    LEFT JOIN (
                                                                                              SELECT *
                                                                                              FROM insurator_planner_fee
                                                                                              WHERE 1=1
                                                                                                    AND del_dt IS NULL
                                                                                      ) ipf ON ipf.planner_id = ip.id
                                                          WHERE 1=1
                                                          ) planner ON planner.id = ij.planner_id
                                                                      AND planner.ins_prod_com_id = ipci.id
                                              LEFT JOIN (
                                                        SELECT *
                                                        FROM insurator_plan_stts
                                                        WHERE 1=1
                                                              AND del_dt IS NULL
                                                        ) ips on ips.plan_stts_cd = ij.plan_stts_cd
            WHERE 1=1
                  AND insured.deleted_dt IS NULL
                  AND insured.del_yn = 'N'
                  AND insured.join_ck IN ('Y','X')
      ) a
      WHERE %%WHERE2%%
    `,
    /* 계약수수료 내역 조회 */

    /* 임시 저장 조회 */
    selectInsuratorDliJoinTmpByReferId: `
      SELECT tmp.id
             , tmp.planner_id AS plannerId
             , tmp.refer_idx AS referId
             , tmp.biz_type AS insuredBizNoGbCd
             , tmp.insured_biz_no AS insuredBizNo
             , tmp.insured_fran_nm AS insuredFranNm
             , tmp.insured_sno AS insuredSno
             , tmp.insured_owner_yn AS insuredOwnerFlag
             , tmp.insured_bzc_cd AS insuredBzcCd
             , tmp.insured_bzc_nm AS insuredBzcNm
             , tmp.insured_bzc_boon_cd AS insuredBzcBoonCd
             , tmp.insured_bzc_boon_nm AS insuredBzcBoonNm
             , CASE WHEN tmp.ins_com = '메리츠' THEN mdoci.obj_nm
                    WHEN tmp.ins_com = 'KB손해보험' THEN kdoci.obj_nm
                    END AS insuredBzcBoonObjNm
             , tmp.calc_amt AS calcAmt
             , tmp.calc_unit_cd AS calcUnitCd
             , tmp.calc_unit_nm AS calcUnitNm
             , tmp.insured_bzc_origin AS insuredBzcOrigin
             , tmp.mgm_bldrgst_pk AS mgmBldrgstPk
             , tmp.sigungu_cd AS sigunguCd
             , tmp.bjdong_cd AS bjdongCd
             , tmp.plat_plc AS insuredJibunAddr
             , tmp.new_plat_plc AS insuredRoadAddr
             , tmp.new_plat_plc_etc AS insuredRoadAddrDetail
             , tmp.zip_cd AS zipCd
             , tmp.acc_yn AS accidentYn
             , tmp.ins_com AS insCom
             , ic.ins_com_cd AS insComCd
             , ic.ins_com_full_nm AS insComFullNm
             , ip2.ins_prod_cd AS insProdCd
             , ip2.ins_prod_nm AS insProdNm
             , ip2.ins_prod_full_nm AS insProdFullNm
             , CONCAT(LEFT(tmp.ins_start_dt, 10), ' ', tmp.ins_start_hm) AS insStartDt
             , CONCAT(LEFT(tmp.ins_end_dt, 10), ' ', tmp.ins_end_hm) AS insEndDt
             , tmp.bd_guaranteed_cost AS bdGuaranteedCost
             , tmp.pt_guaranteed_cost AS ptGuaranteedCost
             , CASE WHEN tmp.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                    WHEN tmp.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                    END bdInsCost
             , CASE WHEN tmp.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                    WHEN tmp.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                    END AS ptInsCost
             , tmp.deductible_ins_cost AS deductibleInsCost
             , tmp.apply_cost AS applyCost
             , tmp.prem_cmpt_log_id AS premCmptLogId
             , tmp.prctr_no AS prctrNo
             , tmp.join_account AS joinAccount
             , tmp.join_path AS joinPath
             , tmp.etc
             , tmp.referer
             , ij.ins_prod_com_id AS insProdComId
             , ij.plan_stts_cd AS planStatusCd
             , ij.fee_amt AS feeAmt
             , tmp.created_dt AS createdDt
             , tmp.updated_dt AS updatedDt
             , ip.user_nm AS userNm
             , ip.username AS userTelNo
             , ig.ga_nm AS gaNm
             , ip.team_id AS teamId
             , iot.team_nm AS teamNm
             , iot.prnt_team_id AS parentTeamId
             , iot.depth AS teamDepth
             , ip.job_pstn_id AS jobPositionId
             , ijp.job_pstn_nm AS jobPositionNm
      FROM tb_insured_dli_info_tmp tmp    LEFT JOIN insurator_join ij ON ij.refer_id = tmp.refer_idx
                                                                         AND ij.planner_id = tmp.planner_id
                                          LEFT JOIN insurator_planner ip ON ip.id = tmp.planner_id
                                          LEFT JOIN   (
                                                      SELECT *
                                                      FROM insurator_ga 
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                      ) ig ON ig.id = ip.ga_id
                                          LEFT JOIN   (
                                                      SELECT *
                                                      FROM insurator_org_team 
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                      ) iot ON ip.team_id = iot.id
                                          LEFT JOIN   (
                                                      SELECT *
                                                      FROM insurator_job_pstn 
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                      ) ijp ON ip.job_pstn_id = ijp.id
                                          LEFT JOIN insurator_ins_prod_com iipc ON ij.ins_prod_com_id = iipc.id
                                          LEFT JOIN ins_prod ip2 ON ip2.id = iipc.ins_prod_id
                                          LEFT JOIN ins_com ic ON ic.id = iipc.ins_com_id
                                          LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON mdmpc.seq_no = tmp.prem_cmpt_log_id
                                          LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON kdmpc.seq_no = tmp.prem_cmpt_log_id
                                          LEFT JOIN tb_meritz_dli_obj_cd_info mdoci ON tmp.insured_bzc_boon_cd = mdoci.obj_cd
                                          LEFT JOIN tb_kb_dli_obj_cd_info kdoci ON tmp.insured_bzc_boon_cd = kdoci.obj_cd
      WHERE 1=1
            AND tmp.del_yn = 'N'
            AND tmp.deleted_dt IS NULL    
            AND tmp.refer_idx = ?
    `,

    selectInsuratorMfliJoinTmpByReferId: `
      SELECT tmp.id
             , tmp.planner_id AS plannerId
             , tmp.refer_idx AS referId
             , tmp.biz_type AS insuredBizNoGbCd
             , tmp.insured_biz_no AS insuredBizNo
             , tmp.insured_fran_nm AS insuredFranNm
             , tmp.insured_sno AS insuredSno
             , tmp.insured_owner_yn AS insuredOwnerFlag
             , tmp.insured_bzc_cd AS insuredBzcCd
             , tmp.insured_bzc_nm AS insuredBzcNm
             , tmp.insured_bzc_boon_cd AS insuredBzcBoonCd
             , tmp.insured_bzc_boon_nm AS insuredBzcBoonNm
             , CASE WHEN tmp.ins_com = '메리츠' THEN mmoci.obj_nm
                    WHEN tmp.ins_com = 'KB손해보험' THEN kmoci.obj_nm
                    END AS insuredBzcBoonObjNm
             , tmp.calc_amt AS calcAmt
             , tmp.calc_unit_cd AS calcUnitCd
             , tmp.calc_unit_nm AS calcUnitNm
             , tmp.insured_bzc_origin AS insuredBzcOrigin
             , tmp.mgm_bldrgst_pk AS mgmBldrgstPk
             , tmp.sigungu_cd AS sigunguCd
             , tmp.bjdong_cd AS bjdongCd
             , tmp.plat_plc AS insuredJibunAddr
             , tmp.new_plat_plc AS insuredRoadAddr
             , tmp.new_plat_plc_etc AS insuredRoadAddrDetail
             , tmp.zip_cd AS zipCd
             , tmp.acc_yn AS accidentYn
             , tmp.ins_com AS insCom
             , ic.ins_com_cd AS insComCd
             , ic.ins_com_full_nm AS insComFullNm
             , ip2.ins_prod_cd AS insProdCd
             , ip2.ins_prod_nm AS insProdNm
             , CONCAT(LEFT(tmp.ins_start_dt, 10), ' ', tmp.ins_start_hm) AS insStartDt
             , CONCAT(LEFT(tmp.ins_end_dt, 10), ' ', tmp.ins_end_hm) AS insEndDt
             , tmp.bd_guaranteed_cost AS bdGuaranteedCost
             , tmp.pt_guaranteed_cost AS ptGuaranteedCost
             , CASE WHEN tmp.ins_com = '메리츠' THEN CAST(mdmpc.pers_apl_prem AS DECIMAL(20,6)) 
                    WHEN tmp.ins_com = 'KB손해보험' THEN kdmpc.bdyinj_prem
                    END AS bdInsCost
             , CASE WHEN tmp.ins_com = '메리츠' THEN CAST(mdmpc.prda_apl_prem AS DECIMAL(20,6)) 
                    WHEN tmp.ins_com = 'KB손해보험' THEN kdmpc.ppdm_prem
                    END AS ptInsCost
             , tmp.deductible_ins_cost AS deductibleInsCost
             , tmp.apply_cost AS applyCost
             , tmp.prem_cmpt_log_id AS premCmptLogId
             , tmp.prctr_no AS prctrNo
             , tmp.join_account AS joinAccount
             , tmp.join_path AS joinPath
             , tmp.etc
             , tmp.referer
             , ij.ins_prod_com_id AS insProdComId
             , ij.plan_stts_cd AS planStatusCd
             , ij.fee_amt AS feeAmt
             , tmp.created_dt AS createdDt
             , tmp.updated_dt AS updatedDt
             , ip.user_nm AS userNm
             , ip.username AS userTelNo
             , ig.ga_nm AS gaNm
             , ip.team_id AS teamId
             , iot.team_nm AS teamNm
             , iot.prnt_team_id AS parentTeamId
             , iot.depth AS teamDepth
             , ip.job_pstn_id AS jobPositionId
             , ijp.job_pstn_nm AS jobPositionNm
      FROM tb_insured_mfli_info_tmp tmp   LEFT JOIN insurator_join ij ON ij.refer_id = tmp.refer_idx
                                                                AND ij.planner_id = tmp.planner_id
                                          LEFT JOIN insurator_planner ip ON ip.id = tmp.planner_id
                                          LEFT JOIN   (
                                                      SELECT *
                                                      FROM insurator_ga 
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                      ) ig ON ig.id = ip.ga_id
                                          LEFT JOIN   (
                                                      SELECT *
                                                      FROM insurator_org_team 
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                      ) iot ON ip.team_id = iot.id
                                          LEFT JOIN   (
                                                      SELECT *
                                                      FROM insurator_job_pstn 
                                                      WHERE 1=1
                                                            AND del_dt IS NULL
                                                      ) ijp ON ip.job_pstn_id = ijp.id
                                          LEFT JOIN insurator_ins_prod_com iipc ON ij.ins_prod_com_id = iipc.id
                                          LEFT JOIN ins_prod ip2 ON ip2.id = iipc.ins_prod_id
                                          LEFT JOIN ins_com ic ON ic.id = iipc.ins_com_id
                                          LEFT JOIN tb_meritz_dli_mfli_prem_cmpt_logs mdmpc ON mdmpc.seq_no = tmp.prem_cmpt_log_id
                                          LEFT JOIN tb_kb_dli_mfli_prem_cmpt_logs kdmpc ON kdmpc.seq_no = tmp.prem_cmpt_log_id
                                          LEFT JOIN tb_meritz_mfli_obj_cd_info mmoci ON tmp.insured_bzc_boon_cd = mmoci.obj_cd
                                          LEFT JOIN tb_kb_mfli_obj_cd_info kmoci ON tmp.insured_bzc_boon_cd = kmoci.obj_cd
      WHERE 1=1
            AND tmp.del_yn = 'N'
            AND tmp.deleted_dt IS NULL    
            AND tmp.refer_idx = ?
    `,
    /* 임시 저장 조회 */

    /* 견적서 파일 조회 */
    selectInsuratorEstimateFileByReferId: `
      SELECT  ief.id
              , ief.insurator_join_id AS insuratorJoinId
              , CONCAT(LEFT(ief.ins_strt_ymd, 10), ' ', ief.ins_strt_tm) AS insStartDt
              , CONCAT(LEFT(ief.ins_end_ymd, 10), ' ', ief.ins_end_tm) AS insEndDt
              , ief.insured_nm AS insuredNm
              , ief.insured_biz_no AS insuredBizNo
              , ief.insured_addr AS insuredAddr
              , ief.insured_addr_dtl AS insuredAddrDetail
              , ief.file_url AS fileUrl
              , ief.send_yn AS sendYn
              , ief.send_dt AS sendDt
              , ij.join_id AS joinId
              , ij.plan_stts_cd AS planStatusCd
      FROM insurator_join ij LEFT JOIN insurator_estimate_file ief ON ief.insurator_join_id = ij.id
      WHERE 1=1
            AND ij.del_dt IS NULL
            AND ij.planner_id IN (%%plannerIds%%)
            AND ij.refer_id = ?
      ORDER BY ief.id DESC
      LIMIT 1
    `,
    /* 견적서 파일 조회 */

    /* 인슈에이터 가입 상품코드 조회 */
    selectInsuratorJoinInsProdByReferId: `
      SELECT  ij.*
              , ipi.ins_prod_cd AS insProdCd
              , ipi.ins_prod_nm AS insProdNm
              , ipi.ins_prod_full_nm AS insProdFullNm
              , ici.ins_com_cd AS insComCd
              , ici.ins_com_nm AS insComNm
              , ici.ins_com_full_nm AS insComFullNm
      FROM insurator_join ij INNER JOIN insurator_ins_prod_com iipc ON ij.ins_prod_com_id = iipc.id
                             INNER JOIN 	(
                                          SELECT *
                                          FROM ins_prod
                                          WHERE 1=1
                                                AND del_dt IS NULL
                                          ) ipi ON iipc.ins_prod_id = ipi.id
                                                   AND ipi.strt_dt <= ij.crt_dt
                                                   AND ipi.end_dt > ij.crt_dt
                             INNER JOIN ins_com ici ON iipc.ins_com_id = ici.id
      WHERE 1=1
            AND ij.del_dt IS NULL
            AND ij.refer_id = ?
    `,
    /* 인슈에이터 가입 상품코드 조회 */
  },
};
