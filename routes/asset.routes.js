const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../database/dbSQL.js');

// Obtener todos los activos
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM dbo.TestTable');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Crear un nuevo activo
router.post('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { name, description, brand, model, quantity, operatingSystem, osVersion, responsibleUser, supportTeam, location, deploymentServer, acquisitionDate, lastAcquisitionDate, macAddress, ipAddress, criticalityLevel, assetClassification, status, recoveryPlan, monitoringFrequency, securityMonitoring, accessAudit } = req.body;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('description', sql.VarChar, description)
            .input('brand', sql.VarChar, brand)
            .input('model', sql.VarChar, model)
            .input('quantity', sql.Int, quantity)
            .input('operatingSystem', sql.VarChar, operatingSystem)
            .input('osVersion', sql.VarChar, osVersion)
            .input('responsibleUser', sql.VarChar, responsibleUser)
            .input('supportTeam', sql.VarChar, supportTeam)
            .input('location', sql.VarChar, location)
            .input('deploymentServer', sql.VarChar, deploymentServer)
            .input('acquisitionDate', sql.DateTime, acquisitionDate)
            .input('lastAcquisitionDate', sql.DateTime, lastAcquisitionDate)
            .input('macAddress', sql.VarChar, macAddress)
            .input('ipAddress', sql.VarChar, ipAddress)
            .input('criticalityLevel', sql.VarChar, criticalityLevel)
            .input('assetClassification', sql.VarChar, assetClassification)
            .input('status', sql.VarChar, status)
            .input('recoveryPlan', sql.VarChar, recoveryPlan)
            .input('monitoringFrequency', sql.VarChar, monitoringFrequency)
            .input('securityMonitoring', sql.VarChar, securityMonitoring)
            .input('accessAudit', sql.VarChar, accessAudit)
            .query('INSERT INTO dbo.TestTable (name, description, brand, model, quantity, operatingSystem, osVersion, responsibleUser, supportTeam, location, deploymentServer, acquisitionDate, lastAcquisitionDate, macAddress, ipAddress, criticalityLevel, assetClassification, status, recoveryPlan, monitoringFrequency, securityMonitoring, accessAudit) VALUES (@name, @description, @brand, @model, @quantity, @operatingSystem, @osVersion, @responsibleUser, @supportTeam, @location, @deploymentServer, @acquisitionDate, @lastAcquisitionDate, @macAddress, @ipAddress, @criticalityLevel, @assetClassification, @status, @recoveryPlan, @monitoringFrequency, @securityMonitoring, @accessAudit)');
        res.status(201).send('Activo creado');
    } catch (err) {
        res.status(500).send('Error al crear el activo');
    }
});

// Actualizar un activo
router.put('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id } = req.params;
        const { name, description, brand, model, quantity, operatingSystem, osVersion, responsibleUser, supportTeam, location, deploymentServer, acquisitionDate, lastAcquisitionDate, macAddress, ipAddress, criticalityLevel, assetClassification, status, recoveryPlan, monitoringFrequency, securityMonitoring, accessAudit } = req.body;
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('description', sql.VarChar, description)
            .input('brand', sql.VarChar, brand)
            .input('model', sql.VarChar, model)
            .input('quantity', sql.Int, quantity)
            .input('operatingSystem', sql.VarChar, operatingSystem)
            .input('osVersion', sql.VarChar, osVersion)
            .input('responsibleUser', sql.VarChar, responsibleUser)
            .input('supportTeam', sql.VarChar, supportTeam)
            .input('location', sql.VarChar, location)
            .input('deploymentServer', sql.VarChar, deploymentServer)
            .input('acquisitionDate', sql.DateTime, acquisitionDate)
            .input('lastAcquisitionDate', sql.DateTime, lastAcquisitionDate)
            .input('macAddress', sql.VarChar, macAddress)
            .input('ipAddress', sql.VarChar, ipAddress)
            .input('criticalityLevel', sql.VarChar, criticalityLevel)
            .input('assetClassification', sql.VarChar, assetClassification)
            .input('status', sql.VarChar, status)
            .input('recoveryPlan', sql.VarChar, recoveryPlan)
            .input('monitoringFrequency', sql.VarChar, monitoringFrequency)
            .input('securityMonitoring', sql.VarChar, securityMonitoring)
            .input('accessAudit', sql.VarChar, accessAudit)
            .query('UPDATE dbo.TestTable SET name = @name, description = @description, brand = @brand, model = @model, quantity = @quantity, operatingSystem = @operatingSystem, osVersion = @osVersion, responsibleUser = @responsibleUser, supportTeam = @supportTeam, location = @location, deploymentServer = @deploymentServer, acquisitionDate = @acquisitionDate, lastAcquisitionDate = @lastAcquisitionDate, macAddress = @macAddress, ipAddress = @ipAddress, criticalityLevel = @criticalityLevel, assetClassification = @assetClassification, status = @status, recoveryPlan = @recoveryPlan, monitoringFrequency = @monitoringFrequency, securityMonitoring = @securityMonitoring, accessAudit = @accessAudit WHERE id = @id');
        res.send('Activo actualizado');
    } catch (err) {
        res.status(500).send('Error al actualizar el activo');
    }
});

// Eliminar un activo
router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id } = req.params;
        await pool.request().input('id', sql.Int, id).query('DELETE FROM dbo.TestTable WHERE id = @id');
        res.send('Activo eliminado');
    } catch (err) {
        res.status(500).send('Error al eliminar el activo');
    }
});

module.exports = router;




