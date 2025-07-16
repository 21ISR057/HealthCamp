import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const resources = {
  en: {
    translation: {
      // Language Selection
      select_language: "Which language do you prefer?",
      select_a_language: "Select a language",
      selected_language: "Selected Language",
      language_changed_to: "Language changed to",
      choose_your_language: "Choose Your Language",
      select_preferred_language: "Select your preferred language to continue",

      // Role Selection
      selectRole: "Select your role",
      user: "User",
      admin: "Admin",
      ngo: "NGO",
      health_student: "Health Student",
      continue: "Continue",

      // App Branding
      app_name: "MediConnect",
      app_tagline: "Your Health, Our Priority",
      join_mediconnect: "Join MediConnect",
      create_health_account: "Create your health account",

      // Authentication
      login: "Login",
      register: "Register",
      sign_in: "Sign In",
      sign_up: "Sign Up",
      email: "Email",
      password: "Password",
      full_name: "Full Name",
      phone_number: "Phone Number",
      confirm_password: "Confirm Password",
      forgot_password: "Forgot Password?",
      already_have_account: "Already have an account?",
      dont_have_account: "Don't have an account?",
      create_account: "Create Account",

      // User Registration
      admin_registration: "Admin Registration",
      user_registration: "User Registration",
      select_admin_role: "Select Admin Role",
      ngo_admin: "NGO Admin",
      ngo_unique_id: "NGO Unique ID",
      student_id: "Student ID",
      gender: "Gender",
      date_of_birth: "Date of Birth",
      locality: "Locality",
      select_district: "Select Your District",
      male: "Male",
      female: "Female",
      other: "Other",

      // Navigation
      health_camps: "Health Camps",
      emergency_service: "Emergency Service",
      medical_report: "Medical Report",
      health_game: "Health Game",
      government_camps: "Government Camps",
      guidelines: "Guidelines",
      profile: "Profile",
      home: "Home",

      // Home Screen
      filter: "Filter",
      clear_all: "Clear All",
      no_health_camps: "No health camps available",
      try_adjusting_filters: "Try adjusting your filters",
      new_health_camp_in: "New Health Camp in",

      // Camp Details
      camp_name: "Camp Name",
      location: "Location",
      date: "Date",
      time: "Time",
      organization: "Organization",
      description: "Description",
      register_for_camp: "Register for Camp",
      view_location_on_maps: "View Location on Maps",

      // Profile
      my_profile: "My Profile",
      edit_profile: "Edit Profile",
      save_changes: "Save Changes",
      cancel: "Cancel",
      my_registered_camps: "My Registered Camps",
      verified_camps: "Verified Camps",
      not_provided: "Not provided",

      // Admin Panel
      admin_panel: "Admin Panel",
      add_camp: "Add Camp",
      view_camps: "View Camps",
      view_registrations: "View Registrations",
      view_feedbacks: "View Feedbacks",

      // Forms
      enter_full_name: "Enter your full name",
      enter_email: "Enter your email",
      enter_password: "Enter your password",
      enter_phone: "Enter your phone number",
      enter_gender: "Enter your gender",
      enter_dob: "Enter your date of birth",

      // Messages
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      registration_successful: "Registration Successful!",
      login_successful: "Login Successful!",
      all_fields_required: "All fields are required!",
      registration_failed: "Registration failed. Try again.",
      invalid_credentials: "Invalid email or password!",
      location_required: "Location Required",
      enable_location_services: "Please enable location services to continue.",

      // Buttons
      ok: "OK",
      yes: "Yes",
      no: "No",
      submit: "Submit",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      back: "Back",
      next: "Next",

      // Common
      loading: "Loading...",
      please_wait: "Please wait...",
      try_again: "Try again",
      or: "or",

      // Additional UI Text
      welcome: "Welcome",
      logout: "Logout",
      settings: "Settings",
      about: "About",
      help: "Help",
      close: "Close",
      open: "Open",
      search: "Search",
      refresh: "Refresh",
      update: "Update",
      upload: "Upload",
      download: "Download",

      // Health Guidelines
      health_guidelines_title: "Health Guidelines & Safety Measures",
      hygiene: "Hygiene",
      nutrition: "Nutrition",
      lifestyle: "Lifestyle",
      vaccination_checkups: "Vaccination & Checkups",
      wash_hands: "Wash hands regularly with soap and water.",
      use_sanitizer: "Use hand sanitizer when soap is unavailable.",
      cover_mouth: "Cover your mouth and nose while sneezing or coughing.",
      disinfect_surfaces: "Disinfect frequently touched surfaces regularly.",
      balanced_diet: "Maintain a balanced diet rich in fruits and vegetables.",
      drink_water: "Drink plenty of water and stay hydrated.",
      limit_sugar: "Limit sugar, salt, and processed food intake.",
      consume_vitamins: "Consume foods rich in vitamins and minerals.",
      exercise_regularly: "Exercise regularly to boost immunity.",
      get_sleep: "Get enough sleep (7-9 hours per night).",
      avoid_smoking: "Avoid smoking, alcohol, and excessive caffeine.",
      manage_stress: "Manage stress through meditation or hobbies.",
      stay_vaccinated: "Stay up-to-date with recommended vaccinations.",
      regular_checkups: "Schedule regular medical checkups.",
      follow_medications: "Follow prescribed medications properly.",
      seek_medical_advice:
        "Be aware of common symptoms and seek medical advice when needed.",

      // Games
      health_games: "Health Games",
      learn_while_play: "Learn while you play!",
      select_age_group: "Select Your Age Group",
      age_6_12: "6-12 years",
      age_13_20: "13-20 years",
      age_20_50: "20-50 years",
      healthy_food_sorting: "Healthy Food Sorting",
      health_quiz: "Health Quiz",
      healthy_habits_puzzle: "Healthy Habits Puzzle",
      score: "Score",
      level: "Level",
      healthy_food: "Healthy Food",
      unhealthy_food: "Unhealthy Food",
      your_score: "Your score",
      next_level: "Next Level",
      match_habit: "Match the habit",

      // Admin Dashboard
      admin_dashboard: "Admin Dashboard",
      add_health_camp: "Add Health Camp",
      create_new_camp: "Create new health camp events",
      view_health_camps: "View Health Camps",
      manage_existing_camps: "Manage existing camps",
      view_complaints: "View Complaints",
      handle_user_complaints: "Handle user complaints",
      view_feedbacks: "View Feedbacks",
      review_user_feedback: "Review user feedback",
      view_registrations: "View Registrations",
      manage_camp_registrations: "Manage camp registrations",
      quick_overview: "Quick Overview",
      active_camps: "Active Camps",
      registrations: "Registrations",
      feedbacks: "Feedbacks",

      // Add Camp Form
      camp_name: "Camp Name",
      camp_description: "Camp Description",
      camp_date: "Camp Date",
      camp_time: "Camp Time",
      camp_location: "Camp Location",
      registration_url: "Registration URL",
      contact_info: "Contact Information",
      camp_capacity: "Camp Capacity",
      enter_camp_name: "Enter camp name",
      enter_description: "Enter camp description",
      select_date: "Select date",
      select_time: "Select time",
      enter_location: "Enter location",
      enter_registration_url: "Enter registration URL",
      enter_contact_info: "Enter contact information",
      enter_capacity: "Enter maximum capacity",
      create_camp: "Create Camp",
      camp_created_successfully: "Camp created successfully!",
      please_fill_all_fields: "Please fill all required fields",
    },
  },
  fr: {
    translation: {
      // Language Selection
      select_language: "Quelle langue préférez-vous ?",
      select_a_language: "Sélectionnez une langue",
      selected_language: "Langue sélectionnée",
      language_changed_to: "Langue changée en",
      choose_your_language: "Choisissez votre langue",
      select_preferred_language:
        "Sélectionnez votre langue préférée pour continuer",

      // Role Selection
      selectRole: "Sélectionnez votre rôle",
      user: "Utilisateur",
      admin: "Administrateur",
      ngo: "ONG",
      health_student: "Étudiant en santé",
      continue: "Continuer",

      // App Branding
      app_name: "MediConnect",
      app_tagline: "Votre santé, notre priorité",
      join_mediconnect: "Rejoignez MediConnect",
      create_health_account: "Créez votre compte santé",

      // Authentication
      login: "Connexion",
      register: "S'inscrire",
      sign_in: "Se connecter",
      sign_up: "S'inscrire",
      email: "Email",
      password: "Mot de passe",
      full_name: "Nom complet",
      phone_number: "Numéro de téléphone",
      confirm_password: "Confirmer le mot de passe",
      forgot_password: "Mot de passe oublié ?",
      already_have_account: "Vous avez déjà un compte ?",
      dont_have_account: "Vous n'avez pas de compte ?",
      create_account: "Créer un compte",

      // User Registration
      admin_registration: "Inscription administrateur",
      user_registration: "Inscription utilisateur",
      select_admin_role: "Sélectionner le rôle d'administrateur",
      ngo_admin: "Administrateur ONG",
      ngo_unique_id: "ID unique ONG",
      student_id: "ID étudiant",
      gender: "Genre",
      date_of_birth: "Date de naissance",
      locality: "Localité",
      select_district: "Sélectionnez votre district",
      male: "Homme",
      female: "Femme",
      other: "Autre",

      // Navigation
      health_camps: "Camps de santé",
      emergency_service: "Service d'urgence",
      medical_report: "Rapport médical",
      health_game: "Jeu de santé",
      government_camps: "Camps gouvernementaux",
      guidelines: "Directives",
      profile: "Profil",
      home: "Accueil",

      // Home Screen
      filter: "Filtrer",
      clear_all: "Tout effacer",
      no_health_camps: "Aucun camp de santé disponible",
      try_adjusting_filters: "Essayez d'ajuster vos filtres",
      new_health_camp_in: "Nouveau camp de santé à",

      // Camp Details
      camp_name: "Nom du camp",
      location: "Emplacement",
      date: "Date",
      time: "Heure",
      organization: "Organisation",
      description: "Description",
      register_for_camp: "S'inscrire au camp",
      view_location_on_maps: "Voir l'emplacement sur les cartes",

      // Profile
      my_profile: "Mon profil",
      edit_profile: "Modifier le profil",
      save_changes: "Sauvegarder les modifications",
      cancel: "Annuler",
      my_registered_camps: "Mes camps inscrits",
      verified_camps: "Camps vérifiés",
      not_provided: "Non fourni",

      // Admin Panel
      admin_panel: "Panneau d'administration",
      add_camp: "Ajouter un camp",
      view_camps: "Voir les camps",
      view_registrations: "Voir les inscriptions",
      view_feedbacks: "Voir les commentaires",

      // Forms
      enter_full_name: "Entrez votre nom complet",
      enter_email: "Entrez votre email",
      enter_password: "Entrez votre mot de passe",
      enter_phone: "Entrez votre numéro de téléphone",
      enter_gender: "Entrez votre genre",
      enter_dob: "Entrez votre date de naissance",

      // Messages
      success: "Succès",
      error: "Erreur",
      warning: "Avertissement",
      info: "Info",
      registration_successful: "Inscription réussie !",
      login_successful: "Connexion réussie !",
      all_fields_required: "Tous les champs sont requis !",
      registration_failed: "Échec de l'inscription. Réessayez.",
      invalid_credentials: "Email ou mot de passe invalide !",
      location_required: "Localisation requise",
      enable_location_services:
        "Veuillez activer les services de localisation pour continuer.",

      // Buttons
      ok: "OK",
      yes: "Oui",
      no: "Non",
      submit: "Soumettre",
      save: "Sauvegarder",
      edit: "Modifier",
      delete: "Supprimer",
      back: "Retour",
      next: "Suivant",

      // Common
      loading: "Chargement...",
      please_wait: "Veuillez patienter...",
      try_again: "Réessayer",
      or: "ou",

      // Additional UI Text
      welcome: "Bienvenue",
      logout: "Déconnexion",
      settings: "Paramètres",
      about: "À propos",
      help: "Aide",
      close: "Fermer",
      open: "Ouvrir",
      search: "Rechercher",
      refresh: "Actualiser",
      update: "Mettre à jour",
      upload: "Télécharger",
      download: "Télécharger",

      // Health Guidelines
      health_guidelines_title: "Directives de santé et mesures de sécurité",
      hygiene: "Hygiène",
      nutrition: "Nutrition",
      lifestyle: "Mode de vie",
      vaccination_checkups: "Vaccination et examens",
      wash_hands:
        "Lavez-vous les mains régulièrement avec du savon et de l'eau.",
      use_sanitizer:
        "Utilisez un désinfectant pour les mains lorsque le savon n'est pas disponible.",
      cover_mouth:
        "Couvrez votre bouche et votre nez en éternuant ou en toussant.",
      disinfect_surfaces:
        "Désinfectez régulièrement les surfaces fréquemment touchées.",
      balanced_diet:
        "Maintenez une alimentation équilibrée riche en fruits et légumes.",
      drink_water: "Buvez beaucoup d'eau et restez hydraté.",
      limit_sugar:
        "Limitez la consommation de sucre, de sel et d'aliments transformés.",
      consume_vitamins:
        "Consommez des aliments riches en vitamines et minéraux.",
      exercise_regularly:
        "Faites de l'exercice régulièrement pour renforcer l'immunité.",
      get_sleep: "Dormez suffisamment (7-9 heures par nuit).",
      avoid_smoking: "Évitez le tabac, l'alcool et la caféine excessive.",
      manage_stress: "Gérez le stress par la méditation ou les loisirs.",
      stay_vaccinated: "Restez à jour avec les vaccinations recommandées.",
      regular_checkups: "Planifiez des examens médicaux réguliers.",
      follow_medications: "Suivez correctement les médicaments prescrits.",
      seek_medical_advice:
        "Soyez conscient des symptômes courants et consultez un médecin si nécessaire.",

      // Games
      health_games: "Jeux de santé",
      learn_while_play: "Apprenez en jouant !",
      select_age_group: "Sélectionnez votre groupe d'âge",
      age_6_12: "6-12 ans",
      age_13_20: "13-20 ans",
      age_20_50: "20-50 ans",
      healthy_food_sorting: "Tri d'aliments sains",
      health_quiz: "Quiz de santé",
      healthy_habits_puzzle: "Puzzle d'habitudes saines",
      score: "Score",
      level: "Niveau",
      healthy_food: "Aliments sains",
      unhealthy_food: "Aliments malsains",
      your_score: "Votre score",
      next_level: "Niveau suivant",
      match_habit: "Associez l'habitude",

      // Admin Dashboard
      admin_dashboard: "Tableau de bord administrateur",
      add_health_camp: "Ajouter un camp de santé",
      create_new_camp: "Créer de nouveaux événements de camp de santé",
      view_health_camps: "Voir les camps de santé",
      manage_existing_camps: "Gérer les camps existants",
      view_complaints: "Voir les plaintes",
      handle_user_complaints: "Traiter les plaintes des utilisateurs",
      view_feedbacks: "Voir les commentaires",
      review_user_feedback: "Examiner les commentaires des utilisateurs",
      view_registrations: "Voir les inscriptions",
      manage_camp_registrations: "Gérer les inscriptions aux camps",
      quick_overview: "Aperçu rapide",
      active_camps: "Camps actifs",
      registrations: "Inscriptions",
      feedbacks: "Commentaires",

      // Add Camp Form
      camp_name: "Nom du camp",
      camp_description: "Description du camp",
      camp_date: "Date du camp",
      camp_time: "Heure du camp",
      camp_location: "Lieu du camp",
      registration_url: "URL d'inscription",
      contact_info: "Informations de contact",
      camp_capacity: "Capacité du camp",
      enter_camp_name: "Entrez le nom du camp",
      enter_description: "Entrez la description",
      select_date: "Sélectionnez la date",
      select_time: "Sélectionnez l'heure",
      enter_location: "Entrez le lieu",
      enter_registration_url: "Entrez l'URL d'inscription",
      enter_contact_info: "Entrez les informations de contact",
      enter_capacity: "Entrez la capacité maximale",
      create_camp: "Créer un camp",
      camp_created_successfully: "Camp créé avec succès !",
      please_fill_all_fields: "Veuillez remplir tous les champs obligatoires",
    },
  },
  es: {
    translation: {
      // Language Selection
      select_language: "¿Qué idioma prefieres?",
      select_a_language: "Selecciona un idioma",
      selected_language: "Idioma seleccionado",
      language_changed_to: "Idioma cambiado a",
      choose_your_language: "Elige tu idioma",
      select_preferred_language:
        "Selecciona tu idioma preferido para continuar",

      // Role Selection
      selectRole: "Selecciona tu rol",
      user: "Usuario",
      admin: "Administrador",
      ngo: "ONG",
      health_student: "Estudiante de salud",
      continue: "Continuar",

      // App Branding
      app_name: "MediConnect",
      app_tagline: "Tu salud, nuestra prioridad",
      join_mediconnect: "Únete a MediConnect",
      create_health_account: "Crea tu cuenta de salud",

      // Authentication
      login: "Iniciar sesión",
      register: "Registrarse",
      sign_in: "Iniciar sesión",
      sign_up: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      full_name: "Nombre completo",
      phone_number: "Número de teléfono",
      confirm_password: "Confirmar contraseña",
      forgot_password: "¿Olvidaste tu contraseña?",
      already_have_account: "¿Ya tienes una cuenta?",
      dont_have_account: "¿No tienes una cuenta?",
      create_account: "Crear cuenta",

      // User Registration
      admin_registration: "Registro de administrador",
      user_registration: "Registro de usuario",
      select_admin_role: "Seleccionar rol de administrador",
      ngo_admin: "Administrador de ONG",
      ngo_unique_id: "ID único de ONG",
      student_id: "ID de estudiante",
      gender: "Género",
      date_of_birth: "Fecha de nacimiento",
      locality: "Localidad",
      select_district: "Selecciona tu distrito",
      male: "Masculino",
      female: "Femenino",
      other: "Otro",

      // Navigation
      health_camps: "Campamentos de salud",
      emergency_service: "Servicio de emergencia",
      medical_report: "Informe médico",
      health_game: "Juego de salud",
      government_camps: "Campamentos gubernamentales",
      guidelines: "Pautas",
      profile: "Perfil",
      home: "Inicio",

      // Home Screen
      filter: "Filtrar",
      clear_all: "Limpiar todo",
      no_health_camps: "No hay campamentos de salud disponibles",
      try_adjusting_filters: "Intenta ajustar tus filtros",
      new_health_camp_in: "Nuevo campamento de salud en",

      // Camp Details
      camp_name: "Nombre del campamento",
      location: "Ubicación",
      date: "Fecha",
      time: "Hora",
      organization: "Organización",
      description: "Descripción",
      register_for_camp: "Registrarse para el campamento",
      view_location_on_maps: "Ver ubicación en mapas",

      // Profile
      my_profile: "Mi perfil",
      edit_profile: "Editar perfil",
      save_changes: "Guardar cambios",
      cancel: "Cancelar",
      my_registered_camps: "Mis campamentos registrados",
      verified_camps: "Campamentos verificados",
      not_provided: "No proporcionado",

      // Admin Panel
      admin_panel: "Panel de administración",
      add_camp: "Agregar campamento",
      view_camps: "Ver campamentos",
      view_registrations: "Ver registros",
      view_feedbacks: "Ver comentarios",

      // Forms
      enter_full_name: "Ingresa tu nombre completo",
      enter_email: "Ingresa tu correo electrónico",
      enter_password: "Ingresa tu contraseña",
      enter_phone: "Ingresa tu número de teléfono",
      enter_gender: "Ingresa tu género",
      enter_dob: "Ingresa tu fecha de nacimiento",

      // Messages
      success: "Éxito",
      error: "Error",
      warning: "Advertencia",
      info: "Información",
      registration_successful: "¡Registro exitoso!",
      login_successful: "¡Inicio de sesión exitoso!",
      all_fields_required: "¡Todos los campos son obligatorios!",
      registration_failed: "Registro fallido. Inténtalo de nuevo.",
      invalid_credentials: "¡Correo electrónico o contraseña inválidos!",
      location_required: "Ubicación requerida",
      enable_location_services:
        "Por favor, habilita los servicios de ubicación para continuar.",

      // Buttons
      ok: "OK",
      yes: "Sí",
      no: "No",
      submit: "Enviar",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      back: "Atrás",
      next: "Siguiente",

      // Common
      loading: "Cargando...",
      please_wait: "Por favor espera...",
      try_again: "Inténtalo de nuevo",
      or: "o",

      // Additional UI Text
      welcome: "Bienvenido",
      logout: "Cerrar sesión",
      settings: "Configuración",
      about: "Acerca de",
      help: "Ayuda",
      close: "Cerrar",
      open: "Abrir",
      search: "Buscar",
      refresh: "Actualizar",
      update: "Actualizar",
      upload: "Subir",
      download: "Descargar",

      // Health Guidelines
      health_guidelines_title: "Pautas de salud y medidas de seguridad",
      hygiene: "Higiene",
      nutrition: "Nutrición",
      lifestyle: "Estilo de vida",
      vaccination_checkups: "Vacunación y chequeos",
      wash_hands: "Lávese las manos regularmente con agua y jabón.",
      use_sanitizer:
        "Use desinfectante para manos cuando no haya jabón disponible.",
      cover_mouth: "Cúbrase la boca y la nariz al estornudar o toser.",
      disinfect_surfaces:
        "Desinfecte regularmente las superficies que se tocan con frecuencia.",
      balanced_diet:
        "Mantenga una dieta equilibrada rica en frutas y verduras.",
      drink_water: "Beba mucha agua y manténgase hidratado.",
      limit_sugar: "Limite el consumo de azúcar, sal y alimentos procesados.",
      consume_vitamins: "Consuma alimentos ricos en vitaminas y minerales.",
      exercise_regularly:
        "Haga ejercicio regularmente para fortalecer la inmunidad.",
      get_sleep: "Duerma lo suficiente (7-9 horas por noche).",
      avoid_smoking: "Evite fumar, el alcohol y la cafeína excesiva.",
      manage_stress:
        "Maneje el estrés a través de la meditación o pasatiempos.",
      stay_vaccinated: "Manténgase al día con las vacunas recomendadas.",
      regular_checkups: "Programe chequeos médicos regulares.",
      follow_medications: "Siga correctamente los medicamentos recetados.",
      seek_medical_advice:
        "Esté atento a los síntomas comunes y busque consejo médico cuando sea necesario.",

      // Games
      health_games: "Juegos de salud",
      learn_while_play: "¡Aprende mientras juegas!",
      select_age_group: "Selecciona tu grupo de edad",
      age_6_12: "6-12 años",
      age_13_20: "13-20 años",
      age_20_50: "20-50 años",
      healthy_food_sorting: "Clasificación de alimentos saludables",
      health_quiz: "Quiz de salud",
      healthy_habits_puzzle: "Rompecabezas de hábitos saludables",
      score: "Puntuación",
      level: "Nivel",
      healthy_food: "Comida saludable",
      unhealthy_food: "Comida no saludable",
      your_score: "Tu puntuación",
      next_level: "Siguiente nivel",
      match_habit: "Relaciona el hábito",

      // Admin Dashboard
      admin_dashboard: "Panel de administración",
      add_health_camp: "Agregar campamento de salud",
      create_new_camp: "Crear nuevos eventos de campamento de salud",
      view_health_camps: "Ver campamentos de salud",
      manage_existing_camps: "Gestionar campamentos existentes",
      view_complaints: "Ver quejas",
      handle_user_complaints: "Manejar quejas de usuarios",
      view_feedbacks: "Ver comentarios",
      review_user_feedback: "Revisar comentarios de usuarios",
      view_registrations: "Ver registros",
      manage_camp_registrations: "Gestionar registros de campamentos",
      quick_overview: "Resumen rápido",
      active_camps: "Campamentos activos",
      registrations: "Registros",
      feedbacks: "Comentarios",

      // Add Camp Form
      camp_name: "Nombre del campamento",
      camp_description: "Descripción del campamento",
      camp_date: "Fecha del campamento",
      camp_time: "Hora del campamento",
      camp_location: "Ubicación del campamento",
      registration_url: "URL de registro",
      contact_info: "Información de contacto",
      camp_capacity: "Capacidad del campamento",
      enter_camp_name: "Ingrese el nombre del campamento",
      enter_description: "Ingrese la descripción",
      select_date: "Seleccione la fecha",
      select_time: "Seleccione la hora",
      enter_location: "Ingrese la ubicación",
      enter_registration_url: "Ingrese la URL de registro",
      enter_contact_info: "Ingrese la información de contacto",
      enter_capacity: "Ingrese la capacidad máxima",
      create_camp: "Crear campamento",
      camp_created_successfully: "¡Campamento creado exitosamente!",
      please_fill_all_fields: "Por favor complete todos los campos requeridos",
    },
  },
  ta: {
    translation: {
      // Language Selection
      select_language: "நீங்கள் எந்த மொழியை விரும்புகிறீர்கள்?",
      select_a_language: "மொழியை தேர்ந்தெடுக்கவும்",
      selected_language: "தேர்ந்தெடுக்கப்பட்ட மொழி",
      language_changed_to: "மொழி மாற்றப்பட்டது",
      choose_your_language: "உங்கள் மொழியை தேர்ந்தெடுக்கவும்",
      select_preferred_language:
        "தொடர உங்கள் விருப்பமான மொழியை தேர்ந்தெடுக்கவும்",

      // Role Selection
      selectRole: "உங்கள் பங்கு தேர்ந்தெடுக்கவும்",
      user: "பயனர்",
      admin: "நிர்வாகி",
      ngo: "சமூக அமைப்பு",
      health_student: "மருத்துவ மாணவர்",
      continue: "தொடரவும்",

      // App Branding
      app_name: "மெடிகனெக்ட்",
      app_tagline: "உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை",
      join_mediconnect: "மெடிகனெக்ட்டில் சேரவும்",
      create_health_account: "உங்கள் ஆரோக்கிய கணக்கை உருவாக்கவும்",

      // Authentication
      login: "உள்நுழைவு",
      register: "பதிவு செய்யவும்",
      sign_in: "உள்நுழைக",
      sign_up: "பதிவு செய்யவும்",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      full_name: "முழு பெயர்",
      phone_number: "தொலைபேசி எண்",
      confirm_password: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      forgot_password: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
      already_have_account: "ஏற்கனவே கணக்கு உள்ளதா?",
      dont_have_account: "கணக்கு இல்லையா?",
      create_account: "கணக்கை உருவாக்கவும்",

      // User Registration
      admin_registration: "நிர்வாகி பதிவு",
      user_registration: "பயனர் பதிவு",
      select_admin_role: "நிர்வாகி பங்கை தேர்ந்தெடுக்கவும்",
      ngo_admin: "சமூக அமைப்பு நிர்வாகி",
      ngo_unique_id: "சமூக அமைப்பு தனிப்பட்ட அடையாள எண்",
      student_id: "மாணவர் அடையாள எண்",
      gender: "பாலினம்",
      date_of_birth: "பிறந்த தேதி",
      locality: "உள்ளூர் பகுதி",
      select_district: "உங்கள் மாவட்டத்தை தேர்ந்தெடுக்கவும்",
      male: "ஆண்",
      female: "பெண்",
      other: "மற்றவை",

      // Navigation
      health_camps: "சுகாதார முகாம்கள்",
      emergency_service: "அவசர சேவை",
      medical_report: "மருத்துவ அறிக்கை",
      health_game: "சுகாதார விளையாட்டு",
      government_camps: "அரசு முகாம்கள்",
      guidelines: "வழிகாட்டுதல்கள்",
      profile: "சுயவிவரம்",
      home: "முகப்பு",

      // Home Screen
      filter: "வடிகட்டி",
      clear_all: "அனைத்தையும் அழிக்கவும்",
      no_health_camps: "சுகாதார முகாம்கள் எதுவும் கிடைக்கவில்லை",
      try_adjusting_filters: "உங்கள் வடிகட்டிகளை சரிசெய்ய முயற்சிக்கவும்",
      new_health_camp_in: "புதிய சுகாதார முகாம்",

      // Camp Details
      camp_name: "முகாம் பெயர்",
      location: "இடம்",
      date: "தேதி",
      time: "நேரம்",
      organization: "அமைப்பு",
      description: "விளக்கம்",
      register_for_camp: "முகாமிற்கு பதிவு செய்யவும்",
      view_location_on_maps: "வரைபடத்தில் இடத்தைப் பார்க்கவும்",

      // Profile
      my_profile: "என் சுயவிவரம்",
      edit_profile: "சுயவிவரத்தை திருத்தவும்",
      save_changes: "மாற்றங்களை சேமிக்கவும்",
      cancel: "ரத்து செய்யவும்",
      my_registered_camps: "என் பதிவு செய்யப்பட்ட முகாம்கள்",
      verified_camps: "சரிபார்க்கப்பட்ட முகாம்கள்",
      not_provided: "வழங்கப்படவில்லை",

      // Admin Panel
      admin_panel: "நிர்வாக பலகம்",
      add_camp: "முகாம் சேர்க்கவும்",
      view_camps: "முகாம்களைப் பார்க்கவும்",
      view_registrations: "பதிவுகளைப் பார்க்கவும்",
      view_feedbacks: "கருத்துகளைப் பார்க்கவும்",

      // Forms
      enter_full_name: "உங்கள் முழு பெயரை உள்ளிடவும்",
      enter_email: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
      enter_password: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
      enter_phone: "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
      enter_gender: "உங்கள் பாலினத்தை உள்ளிடவும்",
      enter_dob: "உங்கள் பிறந்த தேதியை உள்ளிடவும்",

      // Messages
      success: "வெற்றி",
      error: "பிழை",
      warning: "எச்சரிக்கை",
      info: "தகவல்",
      registration_successful: "பதிவு வெற்றிகரமாக முடிந்தது!",
      login_successful: "உள்நுழைவு வெற்றிகரமாக முடிந்தது!",
      all_fields_required: "அனைத்து புலங்களும் தேவை!",
      registration_failed: "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
      invalid_credentials: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்!",
      location_required: "இடம் தேவை",
      enable_location_services: "தொடர இடச் சேவைகளை இயக்கவும்.",

      // Buttons
      ok: "சரி",
      yes: "ஆம்",
      no: "இல்லை",
      submit: "சமர்ப்பிக்கவும்",
      save: "சேமிக்கவும்",
      edit: "திருத்தவும்",
      delete: "நீக்கவும்",
      back: "பின்னால்",
      next: "அடுத்து",

      // Common
      loading: "ஏற்றுகிறது...",
      please_wait: "தயவுசெய்து காத்திருக்கவும்...",
      try_again: "மீண்டும் முயற்சிக்கவும்",
      or: "அல்லது",

      // Additional UI Text
      welcome: "வரவேற்கிறோம்",
      logout: "வெளியேறு",
      settings: "அமைப்புகள்",
      about: "பற்றி",
      help: "உதவி",
      close: "மூடு",
      open: "திற",
      search: "தேடு",
      refresh: "புதுப்பிக்கவும்",
      update: "புதுப்பிக்கவும்",
      upload: "பதிவேற்றவும்",
      download: "பதிவிறக்கவும்",

      // Health Guidelines
      health_guidelines_title:
        "சுகாதார வழிகாட்டுதல்கள் மற்றும் பாதுகாப்பு நடவடிக்கைகள்",
      hygiene: "சுகாதாரம்",
      nutrition: "ஊட்டச்சத்து",
      lifestyle: "வாழ்க்கை முறை",
      vaccination_checkups: "தடுப்பூசி மற்றும் பரிசோதனைகள்",
      wash_hands: "சோப்பு மற்றும் தண்ணீரால் கைகளை அடிக்கடி கழுவவும்.",
      use_sanitizer: "சோப்பு கிடைக்காதபோது கை சுத்திகரிப்பு பயன்படுத்தவும்.",
      cover_mouth:
        "தும்மும்போது அல்லது இருமும்போது வாய் மற்றும் மூக்கை மூடவும்.",
      disinfect_surfaces:
        "அடிக்கடி தொடும் மேற்பரப்புகளை தொடர்ந்து கிருமி நாசினி செய்யவும்.",
      balanced_diet:
        "பழங்கள் மற்றும் காய்கறிகள் நிறைந்த சமச்சீர் உணவை பராமரிக்கவும்.",
      drink_water: "நிறைய தண்ணீர் குடித்து நீரேற்றத்துடன் இருங்கள்.",
      limit_sugar:
        "சர்க்கரை, உப்பு மற்றும் பதப்படுத்தப்பட்ட உணவு உட்கொள்ளலை கட்டுப்படுத்தவும்.",
      consume_vitamins:
        "வைட்டமின்கள் மற்றும் தாதுக்கள் நிறைந்த உணவுகளை உட்கொள்ளவும்.",
      exercise_regularly:
        "நோய் எதிர்ப்பு சக்தியை அதிகரிக்க தொடர்ந்து உடற்பயிற்சி செய்யவும்.",
      get_sleep: "போதுமான தூக்கம் பெறவும் (இரவுக்கு 7-9 மணி நேரம்).",
      avoid_smoking:
        "புகைபிடித்தல், மது மற்றும் அதிகப்படியான காஃபின் தவிர்க்கவும்.",
      manage_stress:
        "தியானம் அல்லது பொழுதுபோக்கு மூலம் மன அழுத்தத்தை நிர்வகிக்கவும்.",
      stay_vaccinated:
        "பரிந்துரைக்கப்பட்ட தடுப்பூசிகளுடன் புதுப்பித்த நிலையில் இருங்கள்.",
      regular_checkups: "வழக்கமான மருத்துவ பரிசோதனைகளை திட்டமிடவும்.",
      follow_medications: "பரிந்துரைக்கப்பட்ட மருந்துகளை சரியாக பின்பற்றவும்.",
      seek_medical_advice:
        "பொதுவான அறிகுறிகளை அறிந்து தேவைப்படும்போது மருத்துவ ஆலோசனை பெறவும்.",

      // Games
      health_games: "சுகாதார விளையாட்டுகள்",
      learn_while_play: "விளையாடும்போது கற்றுக்கொள்ளுங்கள்!",
      select_age_group: "உங்கள் வயது குழுவை தேர்ந்தெடுக்கவும்",
      age_6_12: "6-12 வயது",
      age_13_20: "13-20 வயது",
      age_20_50: "20-50 வயது",
      healthy_food_sorting: "ஆரோக்கியமான உணவு வகைப்படுத்தல்",
      health_quiz: "சுகாதார வினாடி வினா",
      healthy_habits_puzzle: "ஆரோக்கியமான பழக்கவழக்க புதிர்",
      score: "மதிப்பெண்",
      level: "நிலை",
      healthy_food: "ஆரோக்கியமான உணவு",
      unhealthy_food: "ஆரோக்கியமற்ற உணவு",
      your_score: "உங்கள் மதிப்பெண்",
      next_level: "அடுத்த நிலை",
      match_habit: "பழக்கத்தை பொருத்தவும்",

      // Admin Dashboard
      admin_dashboard: "நிர்வாக டாஷ்போர்டு",
      add_health_camp: "சுகாதார முகாம் சேர்க்கவும்",
      create_new_camp: "புதிய சுகாதார முகாம் நிகழ்வுகளை உருவாக்கவும்",
      view_health_camps: "சுகாதார முகாம்களைப் பார்க்கவும்",
      manage_existing_camps: "தற்போதுள்ள முகாம்களை நிர்வகிக்கவும்",
      view_complaints: "புகார்களைப் பார்க்கவும்",
      handle_user_complaints: "பயனர் புகார்களைக் கையாளவும்",
      view_feedbacks: "கருத்துகளைப் பார்க்கவும்",
      review_user_feedback: "பயனர் கருத்துகளை மதிப்பாய்வு செய்யவும்",
      view_registrations: "பதிவுகளைப் பார்க்கவும்",
      manage_camp_registrations: "முகாம் பதிவுகளை நிர்வகிக்கவும்",
      quick_overview: "விரைவு கண்ணோட்டம்",
      active_camps: "செயலில் உள்ள முகாம்கள்",
      registrations: "பதிவுகள்",
      feedbacks: "கருத்துகள்",

      // Add Camp Form
      camp_name: "முகாம் பெயர்",
      camp_description: "முகாம் விளக்கம்",
      camp_date: "முகாம் தேதி",
      camp_time: "முகாம் நேரம்",
      camp_location: "முகாம் இடம்",
      registration_url: "பதிவு URL",
      contact_info: "தொடர்பு தகவல்",
      camp_capacity: "முகாம் திறன்",
      enter_camp_name: "முகாம் பெயரை உள்ளிடவும்",
      enter_description: "விளக்கத்தை உள்ளிடவும்",
      select_date: "தேதியைத் தேர்ந்தெடுக்கவும்",
      select_time: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
      enter_location: "இடத்தை உள்ளிடவும்",
      enter_registration_url: "பதிவு URL ஐ உள்ளிடவும்",
      enter_contact_info: "தொடர்பு தகவலை உள்ளிடவும்",
      enter_capacity: "அதிகபட்ச திறனை உள்ளிடவும்",
      create_camp: "முகாம் உருவாக்கவும்",
      camp_created_successfully: "முகாம் வெற்றிகரமாக உருவாக்கப்பட்டது!",
      please_fill_all_fields:
        "தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்",
    },
  },
};

const loadLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem("language");
    return storedLanguage || "en"; // Default to English if not set
  } catch (error) {
    return "en";
  }
};

// Initialize i18next with stored language
const initializeI18n = async () => {
  const storedLanguage = await loadLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: storedLanguage,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
};

// Initialize on import
initializeI18n();

// Change Language Dynamically
export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem("language", lang);
  i18n.changeLanguage(lang);
};

// Export function to get current language
export const getCurrentLanguage = () => i18n.language;

export default i18n;
