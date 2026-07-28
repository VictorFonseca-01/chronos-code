import { Era } from '../types/game';

export const ERAS_DATA: Era[] = [
  {
    id: 'era_01',
    titleKey: 'era_01_title',
    yearRange: '1950 - 1970',
    iconName: 'Cpu',
    descriptionKey: 'era_01_desc',
    challenges: [
      {
        id: 'backend_01',
        eraId: 'era_01',
        track: 'backend',
        titleKey: 'challenge_be_01_title',
        descriptionKey: {
          javascript: 'challenge_be_01_desc_javascript',
          python: 'challenge_be_01_desc_python',
          java: 'challenge_be_01_desc_java',
        },
        contextKey: 'challenge_be_01_context',
        initialCodeKey: 'challenge_be_01_code',
        initialCode: {
          javascript: `// COMANDOS DO NANO-DRONE NA MATRIZ:
// drone.moveRight(); (Mover para a Direita)
// drone.moveDown();  (Mover para Baixo)
// drone.repair();    (Reparar Nó de Energia)

drone.moveRight();
drone.moveRight();
drone.moveDown();
drone.moveDown();
drone.repair();`,
          python: `# COMANDOS DO NANO-DRONE NA MATRIZ:
# drone.move_right()
# drone.move_down()
# drone.repair()

drone.move_right()
drone.move_right()
drone.move_down()
drone.move_down()
drone.repair()`,
          java: `// COMANDOS DO NANO-DRONE NA MATRIZ:
// drone.moveRight();
// drone.moveDown();
// drone.repair();

drone.moveRight();
drone.moveRight();
drone.moveDown();
drone.moveDown();
drone.repair();`,
        },
        hintsKeys: {
          javascript: ['challenge_be_01_hint1_javascript', 'challenge_be_01_hint2'],
          python: ['challenge_be_01_hint1_python', 'challenge_be_01_hint2'],
          java: ['challenge_be_01_hint1_java', 'challenge_be_01_hint2'],
        },
        xpReward: 150,
        testCases: {
          javascript: [
            { id: 'check_move_right', descriptionKey: 'test_be_01_tc1', testFn: (code: string) => /(moveRight|moverDireita)/i.test(code) },
            { id: 'check_move_down', descriptionKey: 'test_be_01_tc2', testFn: (code: string) => /(moveDown|moverBaixo)/i.test(code) },
            { id: 'check_repair', descriptionKey: 'test_be_01_tc3', testFn: (code: string) => /(repair|reparar)/i.test(code) },
          ],
          python: [
            { id: 'check_move_right', descriptionKey: 'test_be_01_tc1', testFn: (code: string) => /(move_right|mover_direita)/i.test(code) },
            { id: 'check_move_down', descriptionKey: 'test_be_01_tc2', testFn: (code: string) => /(move_down|mover_baixo)/i.test(code) },
            { id: 'check_repair', descriptionKey: 'test_be_01_tc3', testFn: (code: string) => /(repair|reparar)/i.test(code) },
          ],
          java: [
            { id: 'check_move_right', descriptionKey: 'test_be_01_tc1', testFn: (code: string) => /(moveRight|moverDireita)/i.test(code) },
            { id: 'check_move_down', descriptionKey: 'test_be_01_tc2', testFn: (code: string) => /(moveDown|moverBaixo)/i.test(code) },
            { id: 'check_repair', descriptionKey: 'test_be_01_tc3', testFn: (code: string) => /(repair|reparar)/i.test(code) },
          ],
        },
      },
      {
        id: 'frontend_01',
        eraId: 'era_01',
        track: 'frontend',
        titleKey: 'challenge_fe_01_title',
        descriptionKey: {
          html: 'challenge_fe_01_desc',
          react: 'challenge_fe_01_desc_react',
        },
        contextKey: 'challenge_fe_01_context',
        initialCodeKey: 'challenge_fe_01_code',
        initialCode: {
          html: `<!-- SETOR 1: REINICIALIZAÇÃO DO VISOR HOLO -->
<header>
  <!-- Adicione o titulo h1 com a mensagem: Chronos Web node -->
</header>

<main>
  <p>Conexão estabelecida.</p>
  <!-- Adicione a tag <a> para "http://chronos.node" com o texto "Acessar Matriz" -->
</main>`,
          react: `// SETOR 1: COMPONENTES EM REACT (JSX)
export default function ChronosWebNode() {
  return (
    <header>
      {/* Adicione o titulo h1 com a mensagem: Chronos Web node */}
      
      {/* Adicione a tag <a> para "http://chronos.node" com o texto "Acessar Matriz" */}
    </header>
  );
}`,
        },
        hintsKeys: {
          html: ['challenge_fe_01_hint1', 'challenge_fe_01_hint2'],
          react: ['challenge_fe_01_hint1_react', 'challenge_fe_01_hint2_react'],
        },
        xpReward: 150,
        testCases: {
          html: [
            { id: 'check_h1', descriptionKey: 'test_fe_01_tc1', testFn: (code: string) => /<h1>\s*Chronos Web node\s*<\/h1>/i.test(code) },
            { id: 'check_link', descriptionKey: 'test_fe_01_tc2', testFn: (code: string) => /<a\s+href=["']http:\/\/chronos\.node["']>\s*Acessar Matriz\s*<\/a>/i.test(code) },
          ],
          react: [
            { id: 'check_h1', descriptionKey: 'test_fe_01_tc1', testFn: (code: string) => /<h1>\s*Chronos Web node\s*<\/h1>/i.test(code) },
            { id: 'check_link', descriptionKey: 'test_fe_01_tc2', testFn: (code: string) => /<a\s+href=["']http:\/\/chronos\.node["']>\s*Acessar Matriz\s*<\/a>/i.test(code) },
          ],
        },
      },
    ],
  },
  {
    id: 'era_02',
    titleKey: 'era_02_title',
    yearRange: '1980 - 1990',
    iconName: 'Terminal',
    descriptionKey: 'era_02_desc',
    challenges: [
      {
        id: 'backend_02',
        eraId: 'era_02',
        track: 'backend',
        titleKey: 'challenge_be_02_title',
        descriptionKey: {
          javascript: 'challenge_be_02_desc_javascript',
          python: 'challenge_be_02_desc_python',
          java: 'challenge_be_02_desc_java',
        },
        contextKey: 'challenge_be_02_context',
        initialCodeKey: 'challenge_be_02_code',
        initialCode: {
          javascript: `// SETOR 2: ALGORITMOS DE NANO-DRONES INN JAVASCRIPT
// Missão: Envie o Nano-Drone para limpar 3 Glitch Nodes usando um loop 'for'.

for (let i = 0; i < 3; i++) {
    drone.moveRight();
}
drone.repair();`,
          python: `# SETOR 2: ALGORITMOS DE NANO-DRONES EM PYTHON
# Missão: Envie o Nano-Drone para limpar 3 Glitch Nodes usando um loop 'for'.

for i in range(3):
    drone.move_right()
drone.repair()`,
          java: `// SETOR 2: ALGORITMOS DE NANO-DRONES EM JAVA
public class DroneAutomation {
    public static void execute() {
        for (int i = 0; i < 3; i++) {
            drone.moveRight();
        }
        drone.repair();
    }
}`,
        },
        hintsKeys: {
          javascript: ['challenge_be_02_hint1_javascript'],
          python: ['challenge_be_02_hint1_python'],
          java: ['challenge_be_02_hint1_java'],
        },
        xpReward: 250,
        testCases: {
          javascript: [
            { id: 'check_loop', descriptionKey: 'test_be_02_tc1', testFn: (code: string) => /(for|while)/i.test(code) && /(moveRight|moverDireita)/i.test(code) },
          ],
          python: [
            { id: 'check_loop', descriptionKey: 'test_be_02_tc1', testFn: (code: string) => /(for|while)/i.test(code) && /(move_right|mover_direita)/i.test(code) },
          ],
          java: [
            { id: 'check_loop', descriptionKey: 'test_be_02_tc1', testFn: (code: string) => /(for|while)/i.test(code) && /(moveRight|moverDireita)/i.test(code) },
          ],
        },
      },
      {
        id: 'frontend_02',
        eraId: 'era_02',
        track: 'frontend',
        titleKey: 'challenge_fe_02_title',
        descriptionKey: 'challenge_fe_02_desc',
        contextKey: 'challenge_fe_02_context',
        initialCodeKey: 'challenge_fe_02_code',
        initialCode: `/* SETOR 2: FOLHAS DE ESTILO CSS */
.temporal-container {
  /* Defina background-color para #0f172a */
  
  /* Defina display para flex */
  
  /* Defina justify-content para center */
}`,
        hintsKeys: ['challenge_fe_02_hint1'],
        xpReward: 250,
        testCases: [
          { id: 'check_bg_color', descriptionKey: 'test_fe_02_tc1', testFn: (code: string) => /background-color:\s*#0f172a/i.test(code) },
          { id: 'check_flex_center', descriptionKey: 'test_fe_02_tc2', testFn: (code: string) => /display:\s*flex/i.test(code) && /justify-content:\s*center/i.test(code) },
        ],
      },
    ],
  },
];
