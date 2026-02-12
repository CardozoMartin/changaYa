import { checkWorksActiveFn } from "@/services/auth/work.services";
import { Router } from "expo-router";

interface RedirectOptions {
  router: Router;
  showSuccess: (title: string, message: string, options?: any) => void;
  hideAlert: () => void;
  responseData: any;
}

/**
 * Verifica si el usuario tiene trabajos pendientes y redirige a la pantalla correspondiente
 * @returns true si se redirigió a una pantalla de trabajo pendiente, false si debe continuar con el flujo normal
 */
export async function checkAndRedirectPendingWork({
  router,
  showSuccess,
  hideAlert,
  responseData,
}: RedirectOptions): Promise<boolean> {
  try {
    // ⏳ Esperar a que el token se guarde
    await new Promise((resolve) => setTimeout(resolve, 500));


    // ✅ Llamar directamente a la función
    const workData = await checkWorksActiveFn();

    const role = workData?.role;
    let status: boolean = false;
    const workerId = workData?.workerId;
    const employerId = workData?.employerId;
    const workId = workData?.workId;

    // 🔥 Verificar según el rol del usuario
    if (role === "worker") {
      status = workData?.completionStatus?.workerConfirmed;
      if (status === false) {
        router.push({
          pathname: "/(tabs)/Rateworkerscreen",
          params: {
            employerId,
            workId,
            workerId,
          },
        });
        return true; // Indica que se redirigió
      }
    } else if (role === "employer") {
      status = workData?.completionStatus?.employerConfirmed;
      if (status === false) {
        router.push({
          pathname: "/(tabs)/Rateworkerscreen",
          params: {
            workerId,
            workId,
            employerId,
          },
        });
        return true; // Indica que se redirigió
      }
    }

    // 🔥 Verificar si tiene trabajos en progreso
    if (
      workData?.works &&
      Array.isArray(workData.works) &&
      workData.works.length > 0
    ) {
      const activeWork = workData.works[0];

      if (activeWork.status === "in_progress") {
        showSuccess(
          "¡Bienvenido de nuevo!",
          `Tienes un trabajo pendiente: "${activeWork.workTitle}"`,
          {
            customImage: require("../../assets/images/welcome.png"),
            imageStyle: { width: 500, height: 300 },
            primaryButtonText: "Finalizar Trabajo",
            onPrimaryPress: () => {
              hideAlert();
              router.push({
                pathname: "/(tabs)/RateEmployerScreen",
                params: {
                  workId: activeWork.workId,
                  applicationId: activeWork.applicationId,
                  workTitle: activeWork.workTitle,
                },
              });
            },
          }
        );
        return true; // Indica que se redirigió
      }
    }

    return false; // No se redirigió, continuar con flujo normal
  } catch (workError: any) {
    return false; // En caso de error, continuar con flujo normal
  }
}

/**
 * Maneja la redirección después del login basándose en el estado del perfil
 */
export function handlePostLoginRedirect({
  router,
  showSuccess,
  hideAlert,
  responseData,
}: RedirectOptions) {
  const profileCompleted = responseData?.user?.profileCompleted;
  const acceptTerms = responseData?.user?.acceptTerms;

  if (profileCompleted && acceptTerms) {
    showSuccess("¡Inicio de sesión exitoso!", "Bienvenido de nuevo.", {
      customImage: require("../../assets/images/welcome.png"),
      imageStyle: { width: 500, height: 300 },
      primaryButtonText: "Continuar",
      onPrimaryPress: () => {
        hideAlert();
        router.push("/(tabs)/HomeScreen");
      },
    });
  } else {
    showSuccess("¡Inicio de sesión exitoso!", "Completa tu perfil.", {
      customImage: require("../../assets/images/welcome.png"),
      imageStyle: { width: 500, height: 300 },
      primaryButtonText: "Completar Perfil",
      onPrimaryPress: () => {
        hideAlert();
        router.push("/(tabs)/OnboardingScreen");
      },
    });
  }
}