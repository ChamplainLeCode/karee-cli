class KareeProjectConstants {

    static analysis_options_filename = 'analysis_options.yaml'
    static resources_dir = 'resources/'
    static i18n_dir = `${KareeProjectConstants.resources_dir}i18n/`
    static config_dir = `${KareeProjectConstants.resources_dir}config/`

    static config_application_file = `${KareeProjectConstants.config_dir}application.yaml`
    static dictionary_application_file = `${KareeProjectConstants.i18n_dir}en.json`

    static resources_dir_generated = 'lib/resources/'
    static resources_dir_generated_i18n = `${KareeProjectConstants.resources_dir_generated}dictionary.dart`

    static supportedModuleVersion = 'v1.0.0'
    static supportedWpKareeCoreVersion  = 'v1.0.7+2'
}

module.exports = KareeProjectConstants