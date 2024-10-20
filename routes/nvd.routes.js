import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/getVulnerability", async (req, res) => {
    const url = "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=PAX&keywordExactMatch&pubStartDate=2024-08-04T00:00:00.000&pubEndDate=2024-10-22T00:00:00.000";

    try {
        const response = await axios.get(url);
        console.log(response.status);

        if (response.status === 200) {
            res.json(response.data);
        } else {
            res.status(response.status).json(response.data);
        }
    } catch (error) {
        console.error("Error fetching vulnerability:", error);
        res.status(500).json({ detail: "Error fetching vulnerability" });
    }
});

export default router;