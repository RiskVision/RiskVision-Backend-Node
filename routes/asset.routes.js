const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../database/dbSQL.js');

// Obtener todos los activos
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT * FROM dbo.TestTable
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener un activo específico por id_activo
router.get('/:id_activo', async (req, res) => {
    try {
        const { id_activo } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_activo', sql.VarChar, id_activo)
            .query(`
                SELECT * FROM dbo.TestTable 
                WHERE id_activo = @id_activo
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).send('Activo no encontrado');
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Crear un nuevo activo
router.post('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_activo, nombre_activo, descripcion, marca, modelo, cantidad, sistema_operativo, version_os, usuario_responsable, equipo_soporte, ubicacion, servidor_deployment, fecha_adquisicion, fecha_ultima_actualizacion, direccion_mac, direccion_ip, nivel_criticidad, clasificacion_activo, estado, plan_recuperacion_drp, frecuencia_monitoreo, monitoreo_seguridad, auditoria_acceso } = req.body;
        await pool.request()
            .input('id_activo', sql.VarChar, id_activo)
            .input('nombre_activo', sql.VarChar, nombre_activo)
            .input('descripcion', sql.VarChar, descripcion)
            .input('marca', sql.VarChar, marca)
            .input('modelo', sql.VarChar, modelo)
            .input('cantidad', sql.Int, cantidad)
            .input('sistema_operativo', sql.VarChar, sistema_operativo)
            .input('version_os', sql.VarChar, version_os)
            .input('usuario_responsable', sql.VarChar, usuario_responsable)
            .input('equipo_soporte', sql.VarChar, equipo_soporte)
            .input('ubicacion', sql.VarChar, ubicacion)
            .input('servidor_deployment', sql.VarChar, servidor_deployment)
            .input('fecha_adquisicion', sql.VarChar, fecha_adquisicion)
            .input('fecha_ultima_actualizacion', sql.VarChar, fecha_ultima_actualizacion)
            .input('direccion_mac', sql.VarChar, direccion_mac)
            .input('direccion_ip', sql.VarChar, direccion_ip)
            .input('nivel_criticidad', sql.VarChar, nivel_criticidad)
            .input('clasificacion_activo', sql.VarChar, clasificacion_activo)
            .input('estado', sql.VarChar, estado)
            .input('plan_recuperacion_drp', sql.VarChar, plan_recuperacion_drp)
            .input('frecuencia_monitoreo', sql.VarChar, frecuencia_monitoreo)
            .input('monitoreo_seguridad', sql.VarChar, monitoreo_seguridad)
            .input('auditoria_acceso', sql.VarChar, auditoria_acceso)
            .query('INSERT INTO dbo.TestTable (id_activo, nombre_activo, descripcion, marca, modelo, cantidad, sistema_operativo, version_os, usuario_responsable, equipo_soporte, ubicacion, servidor_deployment, fecha_adquisicion, fecha_ultima_actualizacion, direccion_mac, direccion_ip, nivel_criticidad, clasificacion_activo, estado, plan_recuperacion_drp, frecuencia_monitoreo, monitoreo_seguridad, auditoria_acceso) VALUES (@id_activo, @nombre_activo, @descripcion, @marca, @modelo, @cantidad, @sistema_operativo, @version_os, @usuario_responsable, @equipo_soporte, @ubicacion, @servidor_deployment, @fecha_adquisicion, @fecha_ultima_actualizacion, @direccion_mac, @direccion_ip, @nivel_criticidad, @clasificacion_activo, @estado, @plan_recuperacion_drp, @frecuencia_monitoreo, @monitoreo_seguridad, @auditoria_acceso)');
        res.status(201).send('Activo creado');
    } catch (err) {
        res.status(500).send('Error al crear el activo');
    }
});

// Actualizar un activo
router.put('/:id_activo', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_activo } = req.params;
        const { nombre_activo, descripcion, marca, modelo, cantidad, sistema_operativo, version_os, usuario_responsable, equipo_soporte, ubicacion, servidor_deployment, fecha_adquisicion, fecha_ultima_actualizacion, direccion_mac, direccion_ip, nivel_criticidad, clasificacion_activo, estado, plan_recuperacion_drp, frecuencia_monitoreo, monitoreo_seguridad, auditoria_acceso } = req.body;
        await pool.request()
            .input('id_activo', sql.VarChar, id_activo)
            .input('nombre_activo', sql.VarChar, nombre_activo)
            .input('descripcion', sql.VarChar, descripcion)
            .input('marca', sql.VarChar, marca)
            .input('modelo', sql.VarChar, modelo)
            .input('cantidad', sql.Int, cantidad)
            .input('sistema_operativo', sql.VarChar, sistema_operativo)
            .input('version_os', sql.VarChar, version_os)
            .input('usuario_responsable', sql.VarChar, usuario_responsable)
            .input('equipo_soporte', sql.VarChar, equipo_soporte)
            .input('ubicacion', sql.VarChar, ubicacion)
            .input('servidor_deployment', sql.VarChar, servidor_deployment)
            .input('fecha_adquisicion', sql.VarChar, fecha_adquisicion)
            .input('fecha_ultima_actualizacion', sql.VarChar, fecha_ultima_actualizacion)
            .input('direccion_mac', sql.VarChar, direccion_mac)
            .input('direccion_ip', sql.VarChar, direccion_ip)
            .input('nivel_criticidad', sql.VarChar, nivel_criticidad)
            .input('clasificacion_activo', sql.VarChar, clasificacion_activo)
            .input('estado', sql.VarChar, estado)
            .input('plan_recuperacion_drp', sql.VarChar, plan_recuperacion_drp)
            .input('frecuencia_monitoreo', sql.VarChar, frecuencia_monitoreo)
            .input('monitoreo_seguridad', sql.VarChar, monitoreo_seguridad)
            .input('auditoria_acceso', sql.VarChar, auditoria_acceso)
            .query('UPDATE dbo.TestTable SET id_activo = @id_activo, nombre_activo = @nombre_activo, descripcion = @descripcion, marca = @marca, modelo = @modelo, cantidad = @cantidad, sistema_operativo = @sistema_operativo, version_os = @version_os, usuario_responsable = @usuario_responsable, equipo_soporte = @equipo_soporte, ubicacion = @ubicacion, servidor_deployment = @servidor_deployment, fecha_adquisicion = @fecha_adquisicion, fecha_ultima_actualizacion = @fecha_ultima_actualizacion, direccion_mac = @direccion_mac, direccion_ip = @direccion_ip, nivel_criticidad = @nivel_criticidad, clasificacion_activo = @clasificacion_activo, estado = @estado, plan_recuperacion_drp = @plan_recuperacion_drp, frecuencia_monitoreo = @frecuencia_monitoreo, monitoreo_seguridad = @monitoreo_seguridad, auditoria_acceso = @auditoria_acceso WHERE id_activo = @id_activo');
        res.send('Activo actualizado');
    } catch (err) {
        res.status(500).send('Error al actualizar el activo');
    }
});

// Eliminar un activo
router.delete('/:id_activo', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_activo } = req.params;
        await pool.request().input('id_activo', sql.VarChar, id_activo).query('DELETE FROM dbo.TestTable WHERE id_activo = @id_activo');
        res.send('Activo eliminado');
    } catch (err) {
        res.status(500).send('Error al eliminar el activo');
    }
});

module.exports = router;




