// Migration helper functions - completely independent, no external dependencies

/**
 * Migrates settings to ensure all default keys exist
 */
function migrateSettings(oldSettings, defaultSettings) {
    return { 
        ...defaultSettings, 
        ...(oldSettings || {}) 
    };
}

/**
 * Migrates stats and ensures weekly tracking fields exist
 */
function migrateStats(oldStats, defaultStats, getWeekStartDateFn) {
    const migratedStats = { 
        ...defaultStats, 
        ...(oldStats || {}) 
    };
    
    // Preserve completedDates array if valid, otherwise use default
    if (Array.isArray(oldStats?.completedDates)) {
        console.log("preserving completedDates");
        migratedStats.completedDates = oldStats.completedDates;
    } else {
        console.log("setting default completedDates");
        migratedStats.completedDates = [...defaultStats.completedDates];
    }
    
    // Ensure weekStartDate is set
    migratedStats.weekStartDate = oldStats?.weekStartDate ?? getWeekStartDateFn();
    
    return migratedStats;
}

/**
 * Migrates top-level properties
 */
function migrateTopLevel(oldData, defaultTopLevel) {
    return {
        deviceId: oldData.deviceId ?? defaultTopLevel.deviceId,
        lastSync: oldData.lastSync ?? defaultTopLevel.lastSync,
        state: oldData.state ?? defaultTopLevel.state,
    };
}

/**
 * Performs version-specific migrations
 */
function migrateVersion(oldData, currentVersion) {
    if (oldData.version === currentVersion) {
        return oldData;
    }
    
    // Perform version-specific migrations here
    // Example:
    // if (oldData.version === '1.0.0') {
    //     // Migrate from 1.0.0 to 2.0.0
    // }
    
    oldData.version = currentVersion;
    return oldData;
}

/**
 * Main migration function that orchestrates all migrations
 * Completely independent - all dependencies passed as parameters
 */
export function migrateData(oldData, defaultData, currentVersion, getWeekStartDateFn) {
    // Ensure we have an object to work with
    oldData = oldData || {};
    
    // Migrate each section
    const migrated = {
        ...oldData,
        ...migrateTopLevel(oldData, {
            deviceId: defaultData.deviceId,
            lastSync: defaultData.lastSync,
            state: defaultData.state,
        }),
        settings: migrateSettings(oldData.settings, defaultData.settings),
        stats: migrateStats(oldData.stats, defaultData.stats, getWeekStartDateFn),
    };
    
    // Perform version-specific migrations last
    return migrateVersion(migrated, currentVersion);
}

// Usage in your code:
// const migrated = migrateData(parsedData, defaultData, CONFIG.VERSION_KEY, getWeekStartDate);