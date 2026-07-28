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
          javascript: `// ERA 1: CARTÃO PERFURADO & LOGICA EM JAVASCRIPT
// Missão: Defina REG_A = 10, REG_B = 32 e exiba a soma de REG_A + REG_B

let REG_A = 0;
let REG_B = 0;

console.log(REG_A + REG_B);`,
          python: `# ERA 1: CARTÃO PERFURADO & LOGICA EM PYTHON
# Missão: Defina REG_A = 10, REG_B = 32 e imprima a soma de REG_A + REG_B

REG_A = 0
REG_B = 0

print(REG_A + REG_B)`,
          java: `// ERA 1: CARTÃO PERFURADO & LOGICA EM JAVA
// Missão: Defina REG_A = 10, REG_B = 32 e exiba a soma com System.out.println

public class Main {
    public static void main(String[] args) {
        int REG_A = 0;
        int REG_B = 0;
        System.out.println(REG_A + REG_B);
    }
}`,
        },
        hintsKeys: {
          javascript: ['challenge_be_01_hint1_javascript', 'challenge_be_01_hint2'],
          python: ['challenge_be_01_hint1_python', 'challenge_be_01_hint2'],
          java: ['challenge_be_01_hint1_java', 'challenge_be_01_hint2'],
        },
        xpReward: 150,
        testCases: {
          javascript: [
            { id: 'check_reg_a', descriptionKey: 'test_be_01_tc1', testFn: (code: string) => /REG_A\s*=\s*10/i.test(code) },
            { id: 'check_reg_b', descriptionKey: 'test_be_01_tc2', testFn: (code: string) => /REG_B\s*=\s*32/i.test(code) },
            { id: 'check_add', descriptionKey: 'test_be_01_tc3', testFn: (code: string) => /(REG_A\s*\+\s*REG_B|console\.log)/i.test(code) },
          ],
          python: [
            { id: 'check_reg_a', descriptionKey: 'test_be_01_tc1', testFn: (code: string) => /REG_A\s*=\s*10/i.test(code) },
            { id: 'check_reg_b', descriptionKey: 'test_be_01_tc2', testFn: (code: string) => /REG_B\s*=\s*32/i.test(code) },
            { id: 'check_add', descriptionKey: 'test_be_01_tc3', testFn: (code: string) => /(REG_A\s*\+\s*REG_B|print)/i.test(code) },
          ],
          java: [
            { id: 'check_reg_a', descriptionKey: 'test_be_01_tc1', testFn: (code: string) => /(int\s+)?REG_A\s*=\s*10/i.test(code) },
            { id: 'check_reg_b', descriptionKey: 'test_be_01_tc2', testFn: (code: string) => /(int\s+)?REG_B\s*=\s*32/i.test(code) },
            { id: 'check_add', descriptionKey: 'test_be_01_tc3', testFn: (code: string) => /System\.out\.println/i.test(code) },
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
          html: `<!-- ERA 1: O PRIMEIRO DOCUMENTO HYPERTEXTO (CERN 1991) -->
<header>
  <!-- Adicione o titulo h1 com a mensagem: Chronos Web node -->
</header>

<main>
  <p>Conexão estabelecida.</p>
  <!-- Adicione a tag <a> para "http://chronos.node" com o texto "Acessar Matriz" -->
</main>`,
          react: `// ERA 1: COMPONENTES EM REACT (JSX)
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
          javascript: `// ERA 2: ALGORITMOS EM JAVASCRIPT
// Missão: Complete a função calculando a multiplicação de 'cycles' por 'flux_multiplier'.

function calcular_frequencia(cycles, flux_multiplier) {
    // Retorne a multiplicação dos parâmetros abaixo
    return 0;
}`,
          python: `# ERA 2: ALGORITMOS EM PYTHON
# Missão: Complete a função calculando a multiplicação de 'cycles' por 'flux_multiplier'.

def calcular_frequencia(cycles, flux_multiplier):
    # Retorne a multiplicação dos parâmetros abaixo
    return 0`,
          java: `// ERA 2: ALGORITMOS EM JAVA
public class FrequencyCalculator {
    public static int calcularFrequencia(int cycles, int fluxMultiplier) {
        // Retorne a multiplicação de cycles por fluxMultiplier
        return 0;
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
            { id: 'check_return_product', descriptionKey: 'test_be_02_tc1', testFn: (code: string) => /return\s+cycles\s*\*\s*flux_multiplier/i.test(code) },
          ],
          python: [
            { id: 'check_return_product', descriptionKey: 'test_be_02_tc1', testFn: (code: string) => /return\s+cycles\s*\*\s*flux_multiplier/i.test(code) },
          ],
          java: [
            { id: 'check_return_product', descriptionKey: 'test_be_02_tc1', testFn: (code: string) => /return\s+cycles\s*\*\s*fluxMultiplier/i.test(code) },
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
        initialCode: `/* ERA 2: FOLHAS DE ESTILO CSS */
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
