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
        descriptionKey: 'challenge_be_01_desc',
        contextKey: 'challenge_be_01_context',
        initialCodeKey: 'challenge_be_01_code',
        initialCode: `; ERA 1: CARTÃO PERFURADO & ASSEMBLY PRIMITIVO
MOV REG_A, 0
MOV REG_B, 0
ADD REG_A, REG_B
OUT REG_A`,
        hintsKeys: ['challenge_be_01_hint1', 'challenge_be_01_hint2'],
        xpReward: 150,
        testCases: [
          {
            id: 'check_reg_a',
            descriptionKey: 'test_be_01_tc1',
            testFn: (code: string) => /MOV\s+REG_A,\s*10/i.test(code),
          },
          {
            id: 'check_reg_b',
            descriptionKey: 'test_be_01_tc2',
            testFn: (code: string) => /MOV\s+REG_B,\s*32/i.test(code),
          },
          {
            id: 'check_add',
            descriptionKey: 'test_be_01_tc3',
            testFn: (code: string) => /ADD\s+REG_A,\s*REG_B/i.test(code),
          },
        ],
      },
      {
        id: 'frontend_01',
        eraId: 'era_01',
        track: 'frontend',
        titleKey: 'challenge_fe_01_title',
        descriptionKey: 'challenge_fe_01_desc',
        contextKey: 'challenge_fe_01_context',
        initialCodeKey: 'challenge_fe_01_code',
        initialCode: `<!-- ERA 1: O PRIMEIRO DOCUMENTO HYPERTEXTO -->
<header>
</header>
<main>
  <p>Conexão estabelecida.</p>
</main>`,
        hintsKeys: ['challenge_fe_01_hint1', 'challenge_fe_01_hint2'],
        xpReward: 150,
        testCases: [
          {
            id: 'check_h1',
            descriptionKey: 'test_fe_01_tc1',
            testFn: (code: string) => /<h1>\s*Chronos Web node\s*<\/h1>/i.test(code),
          },
          {
            id: 'check_link',
            descriptionKey: 'test_fe_01_tc2',
            testFn: (code: string) => /<a\s+href=["']http:\/\/chronos\.node["']>\s*Acessar Matriz\s*<\/a>/i.test(code),
          },
        ],
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
        descriptionKey: 'challenge_be_02_desc',
        contextKey: 'challenge_be_02_context',
        initialCodeKey: 'challenge_be_02_code',
        initialCode: `// ERA 2: ALGORITMOS EM C
int calcular_frequencia(int cycles, int flux_multiplier) {
    return 0;
}`,
        hintsKeys: ['challenge_be_02_hint1'],
        xpReward: 250,
        testCases: [
          {
            id: 'check_return_product',
            descriptionKey: 'test_be_02_tc1',
            testFn: (code: string) => /return\s+cycles\s*\*\s*flux_multiplier\s*;/i.test(code),
          },
        ],
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
}`,
        hintsKeys: ['challenge_fe_02_hint1'],
        xpReward: 250,
        testCases: [
          {
            id: 'check_bg_color',
            descriptionKey: 'test_fe_02_tc1',
            testFn: (code: string) => /background-color:\s*#0f172a/i.test(code),
          },
          {
            id: 'check_flex_center',
            descriptionKey: 'test_fe_02_tc2',
            testFn: (code: string) => /display:\s*flex/i.test(code) && /justify-content:\s*center/i.test(code),
          },
        ],
      },
    ],
  },
];
